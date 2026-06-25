import { describe, expect, it } from 'vitest'
import { createContainer, injectionToken, injector } from '../src'

describe('Utilities', () => {
    describe('createContainer', () => {
        it('should initialize a container and run builder scope', () => {
            const token = injectionToken<string>('app-name')
            const container = createContainer(c => {
                c.bindSingleton(token, 'node-di')
            })

            expect(container.get(token)).toBe('node-di')
        })

        it('should support destructuring container methods in the builder', () => {
            const token = injectionToken<string>('app-name')
            const container = createContainer(({ bindSingleton }) => {
                bindSingleton(token, 'destructured-node-di')
            })

            expect(container.get(token)).toBe('destructured-node-di')
        })
    })

    describe('injector', () => {
        it('should return a shorthand resolution function', () => {
            const token = injectionToken<string>('config')
            const container = createContainer(c => {
                c.bindSingleton(token, 'development')
            })

            const inject = injector(container)
            expect(inject(token)).toBe('development')
        })
    })

    describe('injectionToken', () => {
        it('should return the token input value unchanged', () => {
            const sym = Symbol('test')
            expect(injectionToken(sym)).toBe(sym)
            expect(injectionToken('my-token')).toBe('my-token')

            class Dummy {}
            expect(injectionToken(Dummy)).toBe(Dummy)
        })
    })
})
