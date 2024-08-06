import { SqlDialect } from '@/lib/dialect/impl/base'

export class DummyDialect extends SqlDialect {
  async getDataSourceTree() {
    return []
  }

  async beginTransaction(): Promise<void> {
    return
  }

  async commitTransaction(): Promise<void> {
    return
  }

  async rollbackTransaction(): Promise<void> {
    return
  }
}
