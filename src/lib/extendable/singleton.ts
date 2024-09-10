import type { EventMap } from '@/lib/events/publisher'
import { Extendable } from '@/lib/extendable/extendable'

export abstract class Singleton<TEvents extends EventMap = {}> extends Extendable<TEvents> {
  // contains the singleton instance
  //  we can't use a private property because we couldn't access it from static methods
  private static __private__instance__: this | null = null

  static getInstance(): this {
    if (this.__private__instance__ === null) {
      this.__private__instance__ = new this()
    }

    return this.__private__instance__
  }

  static get instance(): this {
    return this.getInstance()
  }
}