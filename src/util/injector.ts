import { DIContainer } from '../DIContainer'
import { Injector } from '../Injector'
import { InjectionToken } from '../InjectionToken'

export function injector(container: DIContainer): Injector {
    return (token: InjectionToken<any>) => container.get(token)
}