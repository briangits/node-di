import { DIContainer } from '../DIContainer'

type CreationScope = Pick<DIContainer, 'bind' | 'bindFactory' | 'bindSingleton' | 'get'>

export function createContainer(builder: {
    // (scope: CreationScope): void
    (container: DIContainer): void
}): DIContainer {
    const container = new DIContainer()
    builder(container)
    return container
}
