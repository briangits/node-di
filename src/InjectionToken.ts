type ConcreteConstructor<T> = new (...args: any[]) => T
type AbstractConstructor<T> = abstract new (...args: any[]) => T
export type Constructor<T> = ConcreteConstructor<T> | AbstractConstructor<T>

export type InjectionToken<T> = Constructor<T> | symbol | string
