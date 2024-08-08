export const EventType = {
  Any: 'any',
} as const
export type EventType = (typeof EventType)[keyof typeof EventType]

type EventMap<T> = {
  [EventType.Any]: T[keyof T]
} & {
  [K in keyof T]: T[K]
}

export class EventPublisher<
  T extends {
    [key: string]: unknown[]
  } = {},
> {
  #listeners: {
    [K in keyof EventMap<T>]?: Array<(...args: EventMap<T>[K]) => void>
  } = {}

  on<K extends keyof EventMap<T>>(
    event: K,
    callback: (...args: EventMap<T>[K]) => void,
  ) {
    if (!this.#listeners[event]) {
      this.#listeners[event] = []
    }
    this.#listeners[event]!.push(callback)
  }

  once<K extends keyof EventMap<T>>(
    event: K,
    callback: (...args: EventMap<T>[K]) => void,
  ) {
    const onceCallback = (...args: EventMap<T>[K]) => {
      this.off(event, onceCallback)
      callback(...args)
    }
    this.on(event, onceCallback)
  }

  off<K extends keyof EventMap<T>>(
    event: K,
    callback: (...args: EventMap<T>[K]) => void,
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

  protected emit<K extends keyof EventMap<T>>(
    event: K,
    ...args: EventMap<T>[K]
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
