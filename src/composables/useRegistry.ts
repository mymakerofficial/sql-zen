import { Registry } from '@/lib/registry/registry'

const registry = new Registry()

export function useRegistry() {
  return registry
}
