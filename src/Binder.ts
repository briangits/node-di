import { Binding, BindingLifetime } from './Binding'
import { Factory } from './Factory'
import { InjectionToken } from './InjectionToken'

export class Binder<T> {
    constructor(
        private token: InjectionToken<T>,
        private bindings: Map<InjectionToken<any>, Binding<any>>
    ) {}

    public to(factory: Factory<T>): void {
        this.bindings.set(this.token, {
            lifetime: BindingLifetime.Transient,
            factory
        })
    }

    public toSingleton(factory: Factory<T>): void {
        this.bindings.set(this.token, {
            lifetime: BindingLifetime.Singleton,
            factory
        })
    }
}
