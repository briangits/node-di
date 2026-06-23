type Fn<T, Args extends unknown[]> = (...args: Args) => T

export type Factory<T, Args extends unknown[] = []> = Fn<T, Args>
