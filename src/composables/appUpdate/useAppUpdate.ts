import { check, type Update } from '@tauri-apps/plugin-updater'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { relaunch } from '@tauri-apps/plugin-process'
import { toast } from 'vue-sonner'

export interface UpdateMetadata {
  available: boolean
  currentVersion: string
  version: string
  date?: string
  body?: string
}

const UPDATE_METADATA_DEFAULT: UpdateMetadata = {
  available: false,
  currentVersion: '',
  version: '',
}

let update: Update | null = null

export function useCheckForUpdates() {
  const { mutate: handleUpdate } = useInstallUpdate()

  return useQuery({
    queryKey: ['check-for-app-updates'],
    queryFn: async (): Promise<UpdateMetadata> => {
      update = await check()

      if (!update) {
        return UPDATE_METADATA_DEFAULT
      }

      toast(`SqlZen is ready to Update!`, {
        description:
          'Click to download and install the update, app will restart automatically.',
        duration: 10000,
        action: {
          label: 'Install Now',
          onClick: () => handleUpdate(),
        },
        cancel: {
          label: 'Later',
        },
      })

      return {
        available: update.available,
        currentVersion: update.currentVersion,
        version: update.version,
        date: update.date,
        body: update.body,
      }
    },
    initialData: UPDATE_METADATA_DEFAULT,
  })
}

export function useInstallUpdate() {
  return useMutation({
    mutationKey: ['install-app-update'],
    mutationFn: async () => {
      if (!update) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        throw new Error('No update available')
      }

      await update.downloadAndInstall()
    },
    onMutate: () => {
      toast(`Downloading and installing update ${update?.version}...`, {
        description: 'App will restart automatically',
      })
    },
    onSuccess: async () => {
      await relaunch()
    },
    onError: (error) => {
      toast.error('Failed to install update', {
        description: error.message,
      })
    },
  })
}
