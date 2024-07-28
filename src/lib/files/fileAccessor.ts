export abstract class FileAccessor {
  static fromFileSystemFileHandle(handle: FileSystemFileHandle) {
    return new FileSystemFileHandleAccessor(handle)
  }

  static fromFile(file: File) {
    return new NativeFileAccessor(file)
  }

  static fromBlob(blob: Blob, name: string) {
    return new BlobFileAccessor(blob, name)
  }

  static get Dummy() {
    return new DummyFileAccessor('dummy')
  }

  abstract read(): Promise<Blob>

  abstract getName(): string
}

export class FileSystemFileHandleAccessor extends FileAccessor {
  constructor(private handle: FileSystemFileHandle) {
    super()
  }

  async read() {
    return await this.handle.getFile()
  }

  getName() {
    return this.handle.name
  }
}

export class NativeFileAccessor extends FileAccessor {
  constructor(private file: File) {
    super()
  }

  async read() {
    return this.file
  }

  getName() {
    return this.file.name
  }
}

export class BlobFileAccessor extends FileAccessor {
  constructor(
    private blob: Blob,
    private name: string,
  ) {
    super()
  }

  async read() {
    return this.blob
  }

  getName() {
    return this.name
  }
}

export class DummyFileAccessor extends FileAccessor {
  constructor(private name: string) {
    super()
  }

  async read() {
    return new Blob()
  }

  getName() {
    return this.name
  }
}
