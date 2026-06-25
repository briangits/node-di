/**
 * A generic function representation that returns a value of type T given an array of arguments.
 */
type Fn<T, Args extends unknown[]> = (...args: Args) => T

/**
 * A Factory represents a function that instantiates or retrieves a dependency.
 * It is invoked by the container during dependency resolution.
 *
 * @template T - The type of the dependency created by the factory.
 * @template Args - An array of types for arguments that can be passed to the factory during resolution.
 */
export type Factory<T, Args extends unknown[] = []> = Fn<T, Args>
