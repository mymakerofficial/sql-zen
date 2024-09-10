import { Registry } from '@/lib/registry/impl/registry'

export function useRegistry() {
  return Registry.getInstance()
}
