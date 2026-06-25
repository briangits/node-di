import { Constructor, InjectionToken } from '../InjectionToken'

/**
 * Utility helper to declare and type-bind an InjectionToken.
 * This is primarily used to provide compiler-time type-safety when utilizing strings or symbols as tokens.
 *
 * @template T - The expected resolution type of the dependency associated with this token.
 * @param key - The class constructor, symbol, or string identifying the dependency.
 * @returns The key cast/asserted as an InjectionToken<T>.
 */
export function injectionToken<T>(key: Constructor<T> | symbol | string): InjectionToken<T> {
    return key
}
