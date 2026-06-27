# node-di

A lightweight, type-safe dependency injection (DI) container for Node.js.

```typescript
const DI = createContainer(({ bindFactory, bindSigleton }) => {
    bindFactory(Dice, () => new Dice())

    bindSingleton(DiceRoller, new MyDiceRoller())
})

// inject dependencies
const dice = inject(Dice)
const roller = inject(DiceRoller)

roller.roll(dice)
```

<br />

## Features

- Type-safe bindings and resolutions.
- No decorators, no reflect-metadata, no magic.
- Zero external dependencies.
- Providers: supports singletons and transient instances.
- Use class constructors, symbols, and strings as injection tokens.

## Installation

```bash
pnpm add @briangits/node-di
# or using npm
npm install @briangits/node-di
# or using yarn
yarn add @briangits/node-di
```

## Basic Usage

Use `createContainer` to instantiate and configure your DI container:

```typescript
import { createContainer } from '@briangits/node-di'

const DI = createContainer(c => {
    // Bind a Dice factory
    c.bindFactory(Dice, () => new Dice())

    // Bind a DiceRoller service as a singleton
    c.bindSingleton(DiceRoller, MyDiceRoller)
    //or
    c.bindSingleton(DiceRoller, new MyDiceRoller(c.get(MyOtherDependency)))
})
```

Container methods can also be destructured in the builder callback:

```typescript
const DI = createContainer(({ bind, bindSingleton, bindFactory, get }) => {
    bindFactory(Dice, (salt: string) => new SaltedDice(salt))

    bindSingleton(DiceRoller, () => new MyDiceRoller())
})
```

### Resolve Dependencies

```typescript
// create a short-hand injector function
import { injector } from '@briangits/node-di'

const inject = injector(DI)

// inject yor dependencies
const dice = inject(Dice)
const roller = inject(DiceRoller)
// you can also pass data to the binding factory
const saltedDice = inject(Dice, 'salt-123')

// roll your dice
roller.roll(dice)
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

You can register your binding with either singleton or transient lifetimes:

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
DI.bindFactory(greetToken, (name: string) => `Hello, ${name}`)

const greet = DI.factory<string, [string]>(greetToken)
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

// You can also pass arguments to factories
const dice = inject(Logger, '<request-id>')
```

#### `injectionToken<T>(key: Constructor<T> | symbol | string): InjectionToken<T>`

Casts or assigns a type signature `T` to a token key (such as a string or symbol) for static typing support during resolution.

## License

Apache-2.0
