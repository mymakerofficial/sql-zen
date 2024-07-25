export abstract class FileAccessor {
  static fromFileSystemFileHandle(handle: FileSystemFileHandle) {
    return new FileSystemFileHandleAccessor(handle)
  }

  static fromFile(file: File) {
    return new NativeFileAccessor(file)
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