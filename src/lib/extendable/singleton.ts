import { EventMap } from '@/lib/events/publisher'
import { Extendable } from '@/lib/extendable/extendable'

export abstract class Singleton<TEvents extends EventMap = {}> extends Extendable<TEvents> {
  static #instance: this | null = null

  static getInstance(): this {
    if (this.#instance === null) {
      this.#instance = new this()
    }

    return this.#instance
  }

  static get instance(): this {
    return this.getInstance()
  }
}