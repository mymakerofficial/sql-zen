export const TabType = {
  Empty: 'empty',
  Console: 'console',
} as const
export type TabType = (typeof TabType)[keyof typeof TabType]
