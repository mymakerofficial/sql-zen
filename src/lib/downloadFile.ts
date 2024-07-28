import type { FileAccessor } from '@/lib/files/fileAccessor'

export function downloadFile(fileAccessor: FileAccessor) {
  fileAccessor.read().then((data) => {
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = fileAccessor.getName()
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  })
}
