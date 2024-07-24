export abstract class FileAccessor {
  static fromFileSystemFileHandle(handle: FileSystemFileHandle) {
    return new FileSystemFileAccessor(handle)
  }

  abstract read(): Promise<Blob>

  abstract getName(): string
}

export class FileSystemFileAccessor extends FileAccessor {
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
