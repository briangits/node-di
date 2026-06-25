import { InjectionToken } from './InjectionToken'

export interface Injector {
    <T>(token: InjectionToken<T>): T
}
