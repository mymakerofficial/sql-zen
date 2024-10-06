import { isTauri as getIsTauri } from '@tauri-apps/api/core'
import {
  platform as getPlatform,
  type as getType,
  family as getFamily,
} from '@tauri-apps/plugin-os'
import { useMediaQuery } from '@vueuse/core'

export const Platform = {
  Linux: 'linux',
  MacOS: 'macos',
  IOS: 'ios',
  FreeBSD: 'freebsd',
  DragonFly: 'dragonfly',
  NetBSD: 'netbsd',
  OpenBSD: 'openbsd',
  Solaris: 'solaris',
  Android: 'android',
  Windows: 'windows',
  Browser: 'browser',
} as const
export type Platform = (typeof Platform)[keyof typeof Platform]

export const OsType = {
  Linux: 'linux',
  Windows: 'windows',
  MacOS: 'macos',
  IOS: 'ios',
  Android: 'android',
  Browser: 'browser',
} as const
export type OsType = (typeof OsType)[keyof typeof OsType]

export const Family = {
  Unix: 'unix',
  Windows: 'windows',
  Browser: 'browser',
} as const
export type Family = (typeof Family)[keyof typeof Family]

const isTauri = getIsTauri()
const platform: Platform = isTauri ? getPlatform() : Platform.Browser
const type: OsType = isTauri ? getType() : (OsType.Browser as OsType)
const family: Family = isTauri ? getFamily() : Family.Browser

export function useEnv() {
  return {
    isTauri,
    platform,
    type,
    family,
    isWindows: family === Family.Windows,
    isMacOS: type === OsType.MacOS,
    isSmallScreen: useMediaQuery('(max-width: 640px)'),
  }
}
