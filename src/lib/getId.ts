import { djb2 } from '@/lib/hash'

export function getId(prefix: string = '') {
  const id = djb2(Math.random().toString() + Date.now().toString())
  return prefix ? `${prefix}_${id}` : id
}
