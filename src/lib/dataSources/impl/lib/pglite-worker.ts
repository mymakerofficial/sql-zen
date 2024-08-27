import { PGlite } from '@electric-sql/pglite'
import { type PGliteWorkerOptions, worker } from '@electric-sql/pglite/worker'
import { vector } from '@electric-sql/pglite/vector'

worker({
  async init(options: Exclude<PGliteWorkerOptions, 'extensions'>) {
    return new PGlite({
      ...options,
      extensions: {
        vector,
      },
    })
  },
})
