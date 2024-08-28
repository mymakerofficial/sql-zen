import { PGlite } from '@electric-sql/pglite'
import { type PGliteWorkerOptions, worker } from '@electric-sql/pglite/worker'
import { vector } from '@electric-sql/pglite/vector'
import { WorkerFSMessage } from '@/lib/dataSources/impl/lib/PGliteWorkerFS'

let pglite: PGlite | null = null

worker({
  async init(options: Exclude<PGliteWorkerOptions, 'extensions'>) {
    pglite = await PGlite.create({
      ...options,
      extensions: {
        vector,
      },
    })
    await pglite.waitReady
    return pglite
  },
}).then()

self.addEventListener('message', (event) => {
  const { type, mode, method, args } = event.data

  if (type !== WorkerFSMessage.Type) {
    return
  }

  if (!pglite) {
    self.postMessage({
      type: WorkerFSMessage.Type,
      status: WorkerFSMessage.Status.Error,
      error: 'Tried to use FS before PGlite was initialized.',
    })
    return
  }

  try {
    const result = pglite.Module.FS[method](...args)
    if (mode === WorkerFSMessage.Mode.Void) {
      self.postMessage({
        type: WorkerFSMessage.Type,
        status: WorkerFSMessage.Status.Success,
      })
    } else {
      self.postMessage({
        type: WorkerFSMessage.Type,
        status: WorkerFSMessage.Status.Success,
        result,
      })
    }
  } catch (error) {
    self.postMessage({
      type: WorkerFSMessage.Type,
      status: WorkerFSMessage.Status.Error,
      error,
    })
  }
})
