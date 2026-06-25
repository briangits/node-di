import { DIContainer } from '../DIContainer'
import { InjectionToken } from '../InjectionToken'
import { Injector } from '../Injector'

export function injector(container: DIContainer): Injector {
    return (token: InjectionToken<any>) => container.get(token)
}
