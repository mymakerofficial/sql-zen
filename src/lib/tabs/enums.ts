export const TabType = {
  Test: 'test',
  Empty: 'empty',
  Console: 'console',
  Logger: 'logger',
  Query: 'query',
} as const
export type TabType = (typeof TabType)[keyof typeof TabType]
