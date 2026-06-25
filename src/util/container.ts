import { DIContainer } from '../DIContainer'

/**
 * Utility helper to instantiate a DIContainer and configure its bindings using a builder function.
 *
 * @param builder - A callback function that receives the new DIContainer instance to register dependencies.
 * @returns The fully initialized and configured DIContainer instance.
 */
export function createContainer(builder: { (container: DIContainer): void }): DIContainer {
    const container = new DIContainer()
    builder(container)
    return container
}
