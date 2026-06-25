/**
 * Represents a concrete class constructor.
 */
type ConcreteConstructor<T> = new (...args: any[]) => T

/**
 * Represents an abstract class constructor.
 */
type AbstractConstructor<T> = abstract new (...args: any[]) => T

/**
 * Represents any class constructor, whether concrete or abstract.
 */
export type Constructor<T> = ConcreteConstructor<T> | AbstractConstructor<T>

/**
 * An InjectionToken defines the lookup key used to register and resolve dependencies
 * within the dependency injection container. It can be a class constructor, a symbol, or a string.
 */
export type InjectionToken<T> = Constructor<T> | symbol | string
