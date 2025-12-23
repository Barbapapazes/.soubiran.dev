# Advanced Types & Delegation

Kotlin provides advanced type system features that allow for highly reusable and expressive code.

## Generics & Variance

Kotlin handles generics differently than Java, using declaration-site variance.

### `out` (Covariance)
Allows you to use a `Producer<Derived>` where a `Producer<Base>` is expected. The type can only be **returned** (produced), never passed as an argument.

```kotlin
interface Source<out T> {
    fun nextT(): T
}
```

### `in` (Contravariance)
Allows you to use a `Consumer<Base>` where a `Consumer<Derived>` is expected. The type can only be **consumed**, never returned.

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}
```

### Reified Type Parameters
In Java, generic types are erased at runtime. In Kotlin, using `inline` functions with `reified` parameters allows you to access the type at runtime.

```kotlin
inline fun <reified T> isType(value: Any) = value is T

// Usage
isType<String>("Hello") // true
```

## Class Delegation

The `by` clause allows a class to delegate its interface implementation to another object, eliminating boilerplate for the Decorator pattern.

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

// Derived implements Base by delegating to 'b'
class Derived(b: Base) : Base by b

fun main() {
    val b = BaseImpl(10)
    Derived(b).print() // prints 10
}
```

## Type Aliases

Type aliases provide alternative names for existing types. They don't introduce new types, but they make complex signatures more readable.

```kotlin
typealias NodeSet = Set<Network.Node>
typealias FileTable<K> = MutableMap<K, MutableList<File>>
typealias Handler = (Int, String, Any) -> Unit
```
