# node-di

A lightweight, type-safe dependency injection (DI) container for Node.js.

## Features

- **Type-safe resolution**: Full TypeScript integration for type-safe bindings and resolutions.
- **Zero dependencies**: Pure, minimal implementation with no external runtime dependencies.
- **Multiple token types**: Supports class constructors, symbols, and string-based tokens.
- **Flexible lifetimes**: Supports transient (always fresh) and singleton (cached) instance lifetimes.
- **Shorthand utilities**: Functional helpers for container creation and resolution.

## Installation

```bash
pnpm add @briangits/node-di
# or using npm
npm install @briangits/node-di
# or using yarn
yarn add @briangits/node-di
```

## Basic Usage

### 1. Define Services

```typescript
class DatabaseService {
    public query(sql: string) {
        return `Executing: ${sql}`
    }
}

class UserService {
    constructor(private db: DatabaseService) {}

    public getUser(id: string) {
        return this.db.query(`SELECT * FROM users WHERE id = '${id}'`)
    }
}
```

### 2. Configure the Container

Use `createContainer` to instantiate and configure your dependencies:

```typescript
import { createContainer } from '@briangits/node-di'

const DI = createContainer(c => {
    // Bind DatabaseService as a singleton
    c.bindSingleton(DatabaseService)

    // Bind UserService as a singleton, injecting the DatabaseService instance
    c.bindSingleton(UserService, () => {
        const db = c.get(DatabaseService)
        return new UserService(db)
    })
})
```

Container methods are bound to the instance, so they can be safely destructured in the builder callback:

```typescript
const DI = createContainer(({ bind, bindSingleton, bindFactory, get }) => {
    bindSingleton(DatabaseService)

    bindSingleton(UserService, () => {
        const db = get(DatabaseService)
        return new UserService(db)
    })
})
```

### 3. Resolve Dependencies

```typescript
import { injector } from '@briangits/node-di'

const inject = injector(DI)

const userService = inject(UserService)
console.log(userService.getUser('123'))
```

## Core Concepts

### Injection Tokens

An injection token is the lookup key for a dependency. It can be:

- A class constructor (concrete or abstract)
- A string
- A symbol

For string and symbol tokens, use the `injectionToken<T>` utility to associate a type with the token for compiler-time safety:

```typescript
import { injectionToken } from '@briangits/node-di'

interface Config {
    apiUrl: string
}

// Associate the 'Config' interface with the string-based token
const CONFIG_TOKEN = injectionToken<Config>('app.config')

DI.bindSingleton(CONFIG_TOKEN, { apiUrl: 'https://api.example.com' })

// Resolves automatically to the Config interface type
const config = inject(CONFIG_TOKEN)
```

### Lifetimes

The library supports two lifetimes:

- **Singleton**: The dependency is resolved and instantiated once (lazily, when first requested). Subsequent resolutions return the same cached instance.
- **Transient**: The dependency's factory function is executed on every resolution request, returning a new instance every time.

## API Reference

### DIContainer

#### `bind<T>(token: InjectionToken<T>): Binder<T>`

Starts a binding builder chain for the specified token.

- `bind(token).to(factory)`: Binds to a transient factory function.
- `bind(token).toSingleton(factory)`: Binds to a singleton factory function.

#### `bindFactory<T, Args>(token: InjectionToken<T>, factory: Factory<T, Args>): void`

Shorthand to bind a token to a transient factory function.

#### `bindSingleton<T>(constructor: new () => T): void`

#### `bindSingleton<T>(token: InjectionToken<T>, factory: Factory<T>): void`

#### `bindSingleton<T>(token: InjectionToken<T>, instance: T): void`

Registers a singleton dependency. It accepts either:

- A single class constructor (instantiated dynamically with `new` and no arguments).
- An injection token paired with a factory function.
- An injection token paired with a pre-constructed constant value.

#### `get<T>(token: InjectionToken<T>): T`

Resolves and returns the dependency registered for the given token. Throws an error if no binding exists.

#### `factory<T, Args>(token: InjectionToken<T>): Factory<T, Args>`

Returns a reusable factory function linked to the binding. You can call the returned factory function with custom parameters that are passed into the registered factory.

```typescript
const greetToken = injectionToken<string>('greeter')
container.bindFactory(greetToken, (name: string) => `Hello, ${name}`)

const greet = container.factory<string, [string]>(greetToken)
console.log(greet('Alice')) // "Hello, Alice"
```

### Utility Functions

#### `createContainer(builder: (container: DIContainer) => void): DIContainer`

Helper to initialize a new container and run configuration bindings within a single callback. All container methods are pre-bound to the instance, so they can be safely destructured from the callback argument:

```typescript
createContainer(({ bind, bindSingleton, bindFactory, get }) => {
    bindSingleton(MyService)
})
```

#### `injector(container: DIContainer): Injector`

Creates a shorthand lookup function bound to the container:

```typescript
import { injector } from '@briangits/node-di'

const inject = injector(container)

// Shorthand resolution syntax
const db = inject(DatabaseService)
```

#### `injectionToken<T>(key: Constructor<T> | symbol | string): InjectionToken<T>`

Casts or assigns a type signature `T` to a token key (such as a string or symbol) for static typing support during resolution.

## License

This project is licensed under the Apache-2.0 License.
