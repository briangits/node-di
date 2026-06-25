import { Binder } from './Binder'
import { Binding, BindingLifetime } from './Binding'
import { Factory } from './Factory'
import { Constructor, InjectionToken } from './InjectionToken'

/**
 * DIContainer is a lightweight dependency injection container for managing object instantiation,
 * caching (singletons), and dependency resolution.
 */
export class DIContainer {
    /**
     * Backing store mapping each InjectionToken to its registered Binding configuration.
     */
    private readonly bindings = new Map<InjectionToken<any>, Binding<any, any>>()

    /**
     * Creates a new DIContainer instance and binds its public methods to ensure
     * they can be safely destructured and invoked.
     */
    constructor() {
        this.bind = this.bind.bind(this)
        this.bindFactory = this.bindFactory.bind(this)
        this.bindSingleton = this.bindSingleton.bind(this)
        this.get = this.get.bind(this)
        this.factory = this.factory.bind(this)
    }

    /**
     * Starts the configuration process to bind an injection token to an implementation.
     * Returns a {@link Binder} builder instance to specify the binding lifetime and provider.
     *
     * @template T - The type of the dependency being bound.
     * @param token - The InjectionToken lookup key to bind.
     * @returns A {@link Binder} builder helper to finalize the binding.
     */
    bind<T>(token: InjectionToken<T>): Binder<T> {
        return new Binder(token, this.bindings)
    }

    /**
     * Shorthand method to bind a token to a transient factory function.
     * A new instance of the dependency will be created on every resolution.
     *
     * @template T - The type of the dependency.
     * @template Args - An array of argument types that can be passed to the factory function.
     * @param token - The InjectionToken lookup key.
     * @param factory - The factory function that instantiates the dependency.
     */
    bindFactory<T, Args extends unknown[] = []>(
        token: InjectionToken<T>,
        factory: Factory<T, Args>
    ): void {
        return this.bind(token).to(factory)
    }

    /**
     * Overload: Registers a class constructor as a singleton.
     *
     * @template T - The class type.
     * @param constructor - The class constructor function to instantiate.
     */
    bindSingleton<T>(constructor: new () => T): void
    /**
     * Overload: Registers an injection token to a singleton factory function.
     *
     * @template T - The resolved dependency type.
     * @param token - The InjectionToken lookup key.
     * @param factory - The factory function to create the singleton instance.
     */
    bindSingleton<T>(token: InjectionToken<T>, factory: Factory<T>): void
    /**
     * Overload: Registers an injection token to a pre-constructed constant value.
     *
     * @template T - The resolved dependency type.
     * @param token - The InjectionToken lookup key.
     * @param instance - The pre-constructed singleton instance value.
     */
    bindSingleton<T>(token: InjectionToken<T>, instance: T): void
    /**
     * Registers a dependency with a Singleton lifetime.
     * The singleton instance is lazily instantiated upon its first resolution request
     * and cached for subsequent resolutions.
     */
    bindSingleton<T>(...args: [Constructor<T>] | [InjectionToken<T>, Factory<T> | T]): void {
        if (args.length === 1)
            return this.bind(args[0]).toSingleton(() => new (args[0] as new () => any)())

        if (typeof args[1] === 'function')
            return this.bind(args[0]).toSingleton(args[1] as Factory<T>)

        return this.bind(args[0]).toSingleton(() => args[1] as T)
    }

    /**
     * Resolves a binding by executing its factory function and caching the result if configured as a singleton.
     *
     * @template T - The resolved dependency type.
     * @template Args - The factory function parameter types.
     * @param binding - The active Binding configuration.
     * @param args - The arguments to pass into the factory function.
     * @returns The resolved dependency instance.
     */
    private resolve<T, Args extends unknown[]>(binding: Binding<T, Args>, args: Args): T {
        if (binding.lifetime === BindingLifetime.Singleton) {
            if (binding.instance === undefined) {
                binding.instance = binding.factory(...args)
            }

            return binding.instance as T
        }

        return binding.factory(...args)
    }

    /**
     * Retrieves the resolved instance associated with the specified injection token.
     *
     * @template T - The type of the dependency to retrieve.
     * @param token - The InjectionToken lookup key.
     * @returns The resolved instance.
     * @throws An error if no binding is configured for the given token.
     */
    get<T>(token: InjectionToken<T>): T {
        const binding = this.bindings.get(token)
        if (!binding) throw new Error(`No binding for ${String(token)}`)

        return this.resolve(binding, [])
    }

    /**
     * Returns a shorthand factory function that can be called repeatedly to resolve dependencies with custom arguments.
     *
     * @template T - The type of the dependency.
     * @template Args - The custom arguments expected by the factory function.
     * @param token - The InjectionToken lookup key.
     * @returns A factory function that forwards arguments to the underlying registration.
     * @throws An error if no binding is configured for the given token.
     */
    factory<T, Args extends unknown[] = any[]>(token: InjectionToken<T>): Factory<T, Args> {
        const binding = this.bindings.get(token)
        if (!binding) throw new Error(`No binding for ${String(token)}`)

        return (...args) => binding.factory(...args)
    }
}
