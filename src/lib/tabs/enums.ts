export const TabType = {
  Empty: 'empty',
  Console: 'console',
  Logger: 'logger',
} as const
export type TabType = (typeof TabType)[keyof typeof TabType]
