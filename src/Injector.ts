import { InjectionToken } from './InjectionToken'

/**
 * A shorthand function interface to resolve registered dependencies directly
 * from a dependency injection container.
 */
export interface Injector {
    /**
     * Resolves the dependency registered under the specified injection token.
     *
     * @template T - The type of the dependency to resolve.
     * @param token - The InjectionToken associated with the dependency.
     * @returns The resolved dependency instance.
     * @throws An error if the token is not registered.
     */
    <T>(token: InjectionToken<T>): T
}
