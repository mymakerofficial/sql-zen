export abstract class FileAccessor {
  static #theDummy: FileAccessor | null = null

  static fromFileSystemFileHandle(handle: FileSystemFileHandle) {
    return new FileSystemFileHandleAccessor(handle)
  }

  static fromFile(file: File) {
    return new NativeFileAccessor(file)
  }

  static fromBlob(blob: Blob, name: string) {
    return new BlobFileAccessor(blob, name)
  }

  static fromUint8Array(array: Uint8Array, name: string) {
    return new BlobFileAccessor(new Blob([array]), name)
  }

  static fromText(text: string, name: string) {
    return new BlobFileAccessor(new Blob([text]), name)
  }

  static fromLazy(
    readFn: () => Promise<Blob>,
    { name, size }: { name?: string; size?: number },
  ) {
    return new LazyFileAccessor(name ?? '', size ?? 0, readFn)
  }

  static get Dummy() {
    if (!this.#theDummy) {
      this.#theDummy = new DummyFileAccessor('dummy')
    }

    return this.#theDummy
  }

  abstract readBlob(): Promise<Blob>

  async readText(): Promise<string> {
    const blob = await this.readBlob()
    return await blob.text()
  }

  async readArrayBuffer(): Promise<ArrayBuffer> {
    const blob = await this.readBlob()
    return await blob.arrayBuffer()
  }

  async readUint8Array(): Promise<Uint8Array> {
    const buffer = await this.readArrayBuffer()
    return new Uint8Array(buffer)
  }

  abstract getName(): string

  abstract getSize(): Promise<number | undefined>

  get isDummy(): boolean {
    return this instanceof DummyFileAccessor
  }

  // returns undefined if this is a dummy file accessor, otherwise returns this
  getOrUndefined() {
    return this.isDummy ? undefined : this
  }
}

export abstract class WritableFileAccessor extends FileAccessor {
  abstract writeBlob(blob: Blob): Promise<void>

  async writeText(text: string) {
    const blob = new Blob([text])
    await this.writeBlob(blob)
  }

  async writeArrayBuffer(arrayBuffer: ArrayBuffer) {
    const blob = new Blob([arrayBuffer])
    await this.writeBlob(blob)
  }
}

export class BlobFileAccessor extends FileAccessor {
  constructor(
    private blob: Blob,
    private name: string,
  ) {
    super()
  }

  async readBlob() {
    return this.blob
  }

  getName() {
    return this.name
  }

  async getSize() {
    return this.blob.size
  }
}

export class FileSystemFileHandleAccessor extends WritableFileAccessor {
  private file?: File

  constructor(private handle: FileSystemFileHandle) {
    super()
  }

  async readBlob() {
    if (!this.file) {
      this.file = await this.handle.getFile()
    }

    return this.file
  }

  getName() {
    return this.handle.name
  }

  async getSize() {
    const file = await this.readBlob()
    return file.size
  }

  async writeBlob(blob: Blob) {
    const writable = await this.handle.createWritable()
    await writable.write(blob)
    await writable.close()
  }
}

export class LazyFileAccessor extends FileAccessor {
  private blob?: Blob

  constructor(
    private name: string,
    private size: number,
    private readFn: () => Promise<Blob>,
  ) {
    super()
  }

  async readBlob() {
    if (!this.blob) {
      this.blob = await this.readFn()
    }

    return this.blob
  }

  getName() {
    return this.name
  }

  async getSize() {
    return this.size
  }
}

export class NativeFileAccessor extends FileAccessor {
  constructor(private file: File) {
    super()
  }

  async readBlob() {
    return this.file
  }

  getName() {
    return this.file.name
  }

  async getSize() {
    return this.file.size
  }
}

export class DummyFileAccessor extends FileAccessor {
  constructor(private name: string) {
    super()
  }

  async readBlob() {
    return new Blob()
  }

  getName() {
    return this.name
  }

  async getSize() {
    return 0
  }
}
