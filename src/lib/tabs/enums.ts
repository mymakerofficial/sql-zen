export const TabType = {
  Empty: 'empty',
  Console: 'console',
  Logger: 'logger',
  Query: 'query',
} as const
export type TabType = (typeof TabType)[keyof typeof TabType]
