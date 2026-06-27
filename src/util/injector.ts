import { DIContainer } from '../DIContainer'
import { InjectionToken } from '../InjectionToken'
import { Injector } from '../Injector'

/**
 * Creates a shorthand {@link Injector} function bound to the provided DIContainer.
 * This helper returns a function allowing dependency resolution via a single call,
 * which is useful for simplifying injection logic in application code.
 *
 * @template T - The type of the dependency to resolve.
 * @template Args - The custom arguments expected by the factory function.
 * @param container - The DIContainer instance from which to resolve dependencies.
 * @returns An {@link Injector} shorthand function.
 */
export function injector(container: DIContainer): Injector {
    return <T, Args extends unknown[] = any[]> (token: InjectionToken<T>, ...args: Args) => {
        return container.get(token, ...args)
    }
}
