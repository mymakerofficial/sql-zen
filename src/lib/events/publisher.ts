export const EventType = {
  Any: 'any',
} as const
export type EventType = (typeof EventType)[keyof typeof EventType]

type ResolvedEventMap<T> = {
  [EventType.Any]: T[keyof T]
} & {
  [K in keyof T]: T[K]
}

export type EventMap = {
  [key: string]: unknown[]
}

export class EventPublisher<
  T extends EventMap = {},
> {
  #listeners: {
    [K in keyof ResolvedEventMap<T>]?: Array<(...args: ResolvedEventMap<T>[K]) => void>
  } = {}

  on<K extends keyof ResolvedEventMap<T>>(
    event: K,
    callback: (...args: ResolvedEventMap<T>[K]) => void,
  ) {
    if (!this.#listeners[event]) {
      this.#listeners[event] = []
    }
    this.#listeners[event]!.push(callback)
  }

  once<K extends keyof ResolvedEventMap<T>>(
    event: K,
    callback: (...args: ResolvedEventMap<T>[K]) => void,
  ) {
    const onceCallback = (...args: ResolvedEventMap<T>[K]) => {
      this.off(event, onceCallback)
      callback(...args)
    }
    this.on(event, onceCallback)
  }

  off<K extends keyof ResolvedEventMap<T>>(
    event: K,
    callback: (...args: ResolvedEventMap<T>[K]) => void,
  ) {
    if (!this.#listeners[event]) {
      return
    }

    const index = this.#listeners[event]!.findIndex(
      (listener) => listener === callback,
    )
    if (index === -1) {
      return
    }

    this.#listeners[event]!.splice(index, 1)
  }

  protected emit<K extends keyof ResolvedEventMap<T>>(
    event: K,
    ...args: ResolvedEventMap<T>[K]
  ) {
    if (this.#listeners[EventType.Any]) {
      this.#listeners[EventType.Any]!.forEach((listener) =>
        listener(...(args as any)),
      )
    }
    if (!this.#listeners[event]) {
      return
    }
    this.#listeners[event]!.forEach((listener) => listener(...args))
  }
}
