import { describe, expect, it } from 'vitest'
import { DIContainer } from '../src'
import { injectionToken } from '../src'

describe('DIContainer', () => {
    it('should resolve transient bindings with new instances', () => {
        const container = new DIContainer()
        let count = 0
        const token = injectionToken<number>('count')

        container.bind(token).to(() => ++count)

        expect(container.get(token)).toBe(1)
        expect(container.get(token)).toBe(2)
    })

    it('should resolve singleton bindings with the same instance', () => {
        const container = new DIContainer()
        let count = 0
        const token = injectionToken<number>('count')

        container.bind(token).toSingleton(() => ++count)

        expect(container.get(token)).toBe(1)
        expect(container.get(token)).toBe(1)
    })

    it('should support singleton construction from a class constructor', () => {
        class Service {
            public id = Math.random()
        }

        const container = new DIContainer()
        container.bindSingleton(Service)

        const s1 = container.get(Service)
        const s2 = container.get(Service)

        expect(s1).toBeInstanceOf(Service)
        expect(s1).toBe(s2)
    })

    it('should support singleton registration from a constant instance', () => {
        const container = new DIContainer()
        const token = injectionToken<{ val: string }>('config')
        const instance = { val: 'production' }

        container.bindSingleton(token, instance)

        expect(container.get(token)).toBe(instance)
    })

    it('should throw when resolving an unbound token', () => {
        const container = new DIContainer()
        const token = injectionToken<string>('unbound')

        expect(() => {
            container.get(token)
        }).toThrow(/No binding for unbound/)
    })

    it('should resolve factory functions with arguments', () => {
        const container = new DIContainer()
        const token = injectionToken<string>('greeter')

        container.bindFactory(token, (prefix: string) => `${prefix} World`)

        const greeterFn = container.factory<string>(token)
        expect(greeterFn('Hello')).toBe('Hello World')
    })
})
