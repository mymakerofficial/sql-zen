import { Mutex } from 'async-mutex'

export const WorkerFSMessage = {
  Type: 'FS',
  Mode: {
    Void: 'VOID',
    Returning: 'RETURNING',
  },
  Status: {
    Error: 'ERROR',
    Success: 'SUCCESS',
  },
} as const

interface Stats {
  dev: number
  ino: number
  mode: number
  nlink: number
  uid: number
  gid: number
  rdev: number
  size: number
  blksize: number
  blocks: number
  atime: Date
  mtime: Date
  ctime: Date
  timestamp?: number
}

export class PGliteWorkerFS {
  #mutex = new Mutex()
  #worker: Worker

  constructor(worker: Worker) {
    this.#worker = worker
  }

  #call(mode: string, method: string, ...args: any[]): Promise<any> {
    return this.#mutex.runExclusive(() => {
      return new Promise((resolve, reject) => {
        this.#worker.onmessage = (event) => {
          if (event.data.type !== WorkerFSMessage.Type) {
            return
          }

          if (event.data.status === WorkerFSMessage.Status.Error) {
            reject(event.data.error)
          } else {
            resolve(event.data.result)
          }
        }

        this.#worker.postMessage({
          type: WorkerFSMessage.Type,
          mode,
          method,
          args,
        })
      })
    })
  }

  // Calls the given method without cloning the result.
  async launch(method: string, ...args: any[]) {
    await this.#call(WorkerFSMessage.Mode.Void, method, ...args)
  }

  // Calls the given method and returns a promise that resolves with the result.
  run(method: string, ...args: any[]) {
    return this.#call(WorkerFSMessage.Mode.Returning, method, ...args)
  }

  mkdir(path: string, mode?: number) {
    return this.launch('mkdir', path, mode)
  }

  rename(oldPath: string, newPath: string) {
    return this.launch('rename', oldPath, newPath)
  }

  rmdir(path: string) {
    return this.launch('rmdir', path)
  }

  readdir(path: string): Promise<string[]> {
    return this.run('readdir', path)
  }

  unlink(path: string) {
    return this.launch('unlink', path)
  }

  stat(path: string, dontFollow?: boolean): Promise<Stats> {
    return this.run('stat', path, dontFollow)
  }

  readFile(
    path: string,
    opts: { encoding: 'binary'; flags?: string | undefined },
  ): Promise<Uint8Array>

  readFile(
    path: string,
    opts: { encoding: 'utf8'; flags?: string | undefined },
  ): Promise<string>
  readFile(
    path: string,
    opts?: { flags?: string | undefined },
  ): Promise<Uint8Array>
  readFile(path: string, opts?: object): Promise<Uint8Array | string> {
    return this.run('readFile', path, opts)
  }
  writeFile(
    path: string,
    data: string | ArrayBufferView,
    opts?: { flags?: string | undefined },
  ) {
    return this.launch('writeFile', path, data, opts)
  }

  isFile(mode: number): Promise<boolean> {
    return this.run('isFile', mode)
  }

  isDir(mode: number): Promise<boolean> {
    return this.run('isDir', mode)
  }

  isLink(mode: number): Promise<boolean> {
    return this.run('isLink', mode)
  }

  isChrdev(mode: number): Promise<boolean> {
    return this.run('isChrdev', mode)
  }

  isBlkdev(mode: number): Promise<boolean> {
    return this.run('isBlkdev', mode)
  }

  isFIFO(mode: number): Promise<boolean> {
    return this.run('isFIFO', mode)
  }

  isSocket(mode: number): Promise<boolean> {
    return this.run('isSocket', mode)
  }
}
