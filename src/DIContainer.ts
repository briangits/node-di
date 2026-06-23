import { Constructor, InjectionToken } from './InjectionToken'
import { Binding, BindingLifetime } from './Binding'
import { Binder } from './Binder'
import { Factory } from './Factory'

export class DIContainer {
    private readonly bindings = new Map<InjectionToken<any>, Binding<any, any>>()

    bind<T>(token: InjectionToken<T>): Binder<T> {
        return new Binder(token, this.bindings)
    }

    bindFactory<T, Args extends unknown[] = []>(
        token: InjectionToken<T>,
        factory: Factory<T, Args>
    ): void {
        return this.bind(token).to(factory)
    }

    bindSingleton<T>(constructor: new () => T): void
    bindSingleton<T>(token: InjectionToken<T>, factory: Factory<T>): void
    bindSingleton<T>(token: InjectionToken<T>, instance: T): void
    bindSingleton<T>(
        ...args: [Constructor<T>] | [InjectionToken<T>, Factory<T> | T]
    ): void {
        if (args.length === 1)
            return this.bind(args[0]).toSingleton(() => new (args[0] as new () => any))

        if (typeof args[1] === 'function')
            return this.bind(args[0]).toSingleton(args[1] as Factory<T>)

        return this.bind(args[0]).toSingleton(() => args[1] as T)
    }

    private resolve<T, Args extends unknown[]>(binding: Binding<T, Args>, args: Args): T {
        if (binding.lifetime === BindingLifetime.Singleton) {
            if (binding.instance === undefined) {
                binding.instance = binding.factory(...args)
            }

            return binding.instance as T
        }

        return binding.factory(...args)
    }

    get<T>(token: InjectionToken<T>): T {
        const binding = this.bindings.get(token)
        if (!binding) throw new Error(`No binding for ${String(token)}`)

        return this.resolve(binding, [])
    }

    factory<T, Args extends unknown[] = []>(token: InjectionToken<T>): Factory<T, Args> {
        const binding = this.bindings.get(token)
        if (!binding) throw new Error(`No binding for ${String(token)}`)

        return (...args) => binding.factory(...args)
    }
}