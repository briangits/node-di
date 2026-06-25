import { Factory } from './Factory'

/**
 * Defines the resolution and caching strategy for a registered dependency.
 */
export enum BindingLifetime {
    /**
     * A new instance is created on every resolution request.
     */
    Transient,
    /**
     * A single instance is created on the first resolution request and cached for all subsequent requests.
     */
    Singleton,
    /**
     * Reserved for future scoped dependency injection implementations.
     */
    Scoped
}

/**
 * Represents a registered dependency binding within the container.
 *
 * @template T - The type of the dependency instance being resolved.
 * @template Args - An array of arguments passed to the factory function during resolution.
 */
export interface Binding<T, Args extends unknown[] = []> {
    /**
     * The lifetime configuration of the binding.
     */
    lifetime: BindingLifetime
    /**
     * The factory function responsible for instantiating the dependency.
     */
    factory: Factory<T, Args>
    /**
     * The cached singleton instance, if the lifetime is Singleton and it has been resolved.
     */
    instance?: T
}
