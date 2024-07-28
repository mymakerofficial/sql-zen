export function runPromised<TResult>(block: () => TResult): Promise<TResult> {
  return new Promise((resolve, reject) => {
    try {
      resolve(block())
    } catch (e) {
      reject(e)
    }
  })
}
