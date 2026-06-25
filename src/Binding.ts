import { Factory } from './Factory'

export enum BindingLifetime {
    Transient,
    Singleton,
    Scoped
}

export interface Binding<T, Args extends unknown[] = []> {
    lifetime: BindingLifetime
    factory: Factory<T, Args>
    instance?: T
}
