import { type EventMap, EventPublisher } from '@/lib/events/publisher'

type DismountCallback = () => void
type OnDismount = (dismountCallback: DismountCallback) => void

type PluginResult<TResult> = {
  onDismount: DismountCallback,
  result: TResult
}

export type Plugin<TClass extends Extendable, TResult> = (extendable: TClass) => PluginResult<TResult>

export type PluginSetup<TClass extends Extendable, TResult> = (extendable: TClass, onDismount: OnDismount) => TResult

export abstract class Extendable<TEvents extends EventMap = {}> extends EventPublisher<TEvents> {
  // set containing dismount callbacks for all registered plugins
  #plugins: Set<DismountCallback> = new Set()

  // register a plugin on this instance
  use<TResult>(plugin: Plugin<this, TResult>): TResult {
    const { onDismount, result } = plugin(this)
    this.#plugins.add(onDismount)
    return result
  }

  // dismount all currently registered plugins
  protected dismountPlugins() {
    for (const dismount of this.#plugins) {
      dismount()
    }
  }

  // create a plugin that can be registered on an instance of this class using the `use` method
  static definePlugin<TResult>(setup: PluginSetup<this, TResult>): Plugin<this, TResult> {
    // onDismount could be called multiple times,
    //  so we need to keep track of all dismount callbacks
    const dismountCallbacks: Set<DismountCallback> = new Set()

    return (extendable: Extendable<this>) => {
      const result = setup(extendable, (dismountCallback) => {
        dismountCallbacks.add(dismountCallback)
      })

      const onDismount = () => {
        for (const dismount of dismountCallbacks) {
          dismount()
        }
      }

      return {
        onDismount,
        result
      }
    }
  }
}