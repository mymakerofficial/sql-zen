export function simplifyIdentifier(identifier: string | null) {
  if (!identifier) {
    return null
  }

  if (identifier === 'null') {
    return null
  }

  if (identifier === 'database') {
    return null
  }

  if (identifier === 'default') {
    return null
  }

  return identifier
}
