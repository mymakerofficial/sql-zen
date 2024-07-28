import { SqlDialect } from '@/lib/dialect/impl/base'

export class DummyDialect extends SqlDialect {
  async getSchemaTree() {
    return []
  }
}
