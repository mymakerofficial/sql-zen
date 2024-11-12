import type { Component, MaybeRefOrGetter } from 'vue'
import type { Statement } from '@/lib/statements/interface'

export const RunButtonMode = {
  RunSelected: 'run-selected',
  RunSelectedDown: 'run-selected-down',
  RunAll: 'run-all',
} as const
export type RunButtonMode = (typeof RunButtonMode)[keyof typeof RunButtonMode]

export type RunButtonModeOption = {
  value: RunButtonMode
  label: string
  description: string
  icon: Component
  statements: MaybeRefOrGetter<Statement[]>
}
