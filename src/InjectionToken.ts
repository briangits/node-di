type ConcreteConstructor<T> = new (...args: unknown[]) => T
type AbstractConstructor<T> = new (...args: unknown[]) => T
export type Constructor<T> = ConcreteConstructor<T> | AbstractConstructor<T>

export type InjectionToken<T> = Constructor<T> | symbol | string

