import { Constructor, InjectionToken } from '../InjectionToken'

export function injectionToken<T>(
    key: Constructor<T> | symbol | string
): InjectionToken<T> {
    return key
}
