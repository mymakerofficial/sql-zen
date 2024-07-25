import { djb2 } from '@/lib/hash'

export function id() {
  return djb2(Math.random().toString() + Date.now().toString())
}
