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
}
