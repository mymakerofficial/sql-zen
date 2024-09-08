import * as seline from '@seline-analytics/web'
import { useDebounceFn } from '@vueuse/core'
import { toast } from 'vue-sonner'

const AnalyticsConsent = {
  NotAsked: 'not-asked',
  Denied: 'denied',
  Granted: 'granted',
} as const

const CONSENT_STORAGE_KEY = 'sql-zen-analytics-user-consent'

const isProd = import.meta.env.PROD

function log(...args: any[]) {
  console.log(
    '%canalytics',
    'color: white; background-color: #0284c7; padding: 2px 4px; border-radius: 2px;',
    ...args,
  )
}

function getConsent() {
  const value = localStorage.getItem(CONSENT_STORAGE_KEY)
  return value ?? AnalyticsConsent.NotAsked
}

function isConsentGranted() {
  return getConsent() === AnalyticsConsent.Granted
}

function handleConsent() {
  localStorage.setItem(CONSENT_STORAGE_KEY, AnalyticsConsent.Granted)
  toast.message('Thanks ❤️', {
    duration: 1000,
  })
  rawTrack('analytics-consent-granted')
}

function handleDenial() {
  localStorage.setItem(CONSENT_STORAGE_KEY, AnalyticsConsent.Denied)
}

function askForConsent() {
  toast.message('We use analytics to improve your experience!', {
    description: 'Would you like to share anonymized usage data with us?',
    action: {
      label: 'Yes Sure!',
      onClick: handleConsent,
    },
    cancel: {
      label: 'No',
      onClick: handleDenial,
    },
    duration: Infinity,
  })
}

function init() {
  // Always track page views, we do this to know how many users are using the app.
  //  Only track more detailed events if the user consents!

  initSeline()

  const userConsent = getConsent()
  if (userConsent === AnalyticsConsent.NotAsked) {
    askForConsent()
  }
}

function initSeline() {
  // if (!isProd) {
  //   log('Skipping analytics init in development')
  //   return
  // }

  seline.init()

  if (isConsentGranted()) {
    log('Thank you for helping us improve SqlZen! 🤗')
  } else {
    log('Only tracking page views. No detailed information will be sent.')
  }
}

function rawTrack(name: string, data?: Record<string, unknown> | null) {
  if (!isConsentGranted()) return

  // the user should see what's being tracked
  log('event', name, data)

  if (!isProd) return

  seline.track(name, data)
}

const track = useDebounceFn(rawTrack, 1000)

export function useSeline() {
  return {
    init,
    // never include strings that could contain sensitive data in the data object!
    track: (name: string, data?: Record<string, unknown> | null) => {
      track(name, data).then()
    },
  }
}
