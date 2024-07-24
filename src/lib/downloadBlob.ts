import type { DatabaseDump } from '@/lib/databases/database'

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}

export function downloadDump(data: DatabaseDump) {
  downloadBlob(data.blob, data.filename)
}