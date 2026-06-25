import { Binding, BindingLifetime } from './Binding'
import { Factory } from './Factory'
import { InjectionToken } from './InjectionToken'

/**
 * A fluent builder helper to configure dependency bindings.
 *
 * @template T - The type of the dependency instance being bound.
 */
export class Binder<T> {
    /**
     * Creates a new instance of the Binder.
     *
     * @param token - The InjectionToken lookup key being bound.
     * @param bindings - The backing map storing the dependency configurations.
     */
    constructor(
        private token: InjectionToken<T>,
        private bindings: Map<InjectionToken<any>, Binding<any>>
    ) {}

    /**
     * Binds the injection token to a transient factory function.
     * A new instance will be returned on every resolution request.
     *
     * @param factory - The factory function that produces the dependency instance.
     */
    public to(factory: Factory<T>): void {
        this.bindings.set(this.token, {
            lifetime: BindingLifetime.Transient,
            factory
        })
    }

    /**
     * Binds the injection token to a singleton factory function.
     * The first resolution request executes the factory, and subsequent requests
     * return the cached result of that first execution.
     *
     * @param factory - The factory function that produces the singleton dependency instance.
     */
    public toSingleton(factory: Factory<T>): void {
        this.bindings.set(this.token, {
            lifetime: BindingLifetime.Singleton,
            factory
        })
    }
}
