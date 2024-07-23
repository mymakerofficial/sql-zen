import {
  type AllowedComponentProps,
  type Component,
  computed,
  h,
  inject,
  provide,
  reactive,
  ref,
  type VNode,
  type VNodeProps,
} from 'vue'
import { createGlobalState, whenever } from '@vueuse/core'
import { id } from '@/lib/id'

export const useDialogState = createGlobalState(() => {
  const dialogs = reactive<Record<string, VNode>>({})

  function addDialog(id: string, dialog: VNode) {
    dialogs[id] = dialog
  }

  function disposeDialog(id: string) {
    delete dialogs[id]
  }

  return {
    dialogs: computed(() => Object.entries(dialogs)),
    addDialog,
    disposeDialog,
  }
})

type ComponentProps<TComponent extends Component> = TComponent extends new (
  ...args: any
) => any
  ? Omit<
      InstanceType<TComponent>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never

export function useDialog<TComponent extends Component>(component: TComponent) {
  const { addDialog } = useDialogState()

  function open(props?: ComponentProps<TComponent>) {
    addDialog(id(), h(component, props))
  }

  return {
    open,
  }
}

export function useProvedDialogContext(key: string) {
  provide('__dialog_context_id__', key)
}

export function useDialogContext() {
  const id = inject<string | null>('__dialog_context_id__', null)
  const { disposeDialog } = useDialogState()

  const open = ref(id !== null)

  whenever(
    () => !open.value,
    () => {
      // TODO race condition incoming
      setTimeout(() => {
        disposeDialog(id!)
      }, 200)
    },
  )

  function close() {
    open.value = false
  }

  return {
    open,
    close,
  }
}
