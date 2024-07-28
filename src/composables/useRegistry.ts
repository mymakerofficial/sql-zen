import { Registry } from '@/lib/registry/impl/registry'

const registry = new Registry()

export function useRegistry() {
  return registry
}
