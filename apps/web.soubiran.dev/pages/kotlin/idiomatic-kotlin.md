# Idiomatic Kotlin

Writing "idiomatic" Kotlin means leveraging the language's unique features to write code that is concise, readable, and safe.

## Scope Functions

Scope functions execute a block of code within the context of an object. There are five: `let`, `run`, `with`, `apply`, and `also`.

| Function | Object Reference | Return Value | Use Case |
| :--- | :--- | :--- | :--- |
| **`let`** | `it` | Lambda result | Null checks, mapping. |
| **`apply`** | `this` | Context object | Object configuration (builder pattern). |
| **`also`** | `it` | Context object | Side effects (logging, validation). |
| **`run`** | `this` | Lambda result | Initialization and computation. |
| **`with`** | `this` | Lambda result | Grouping function calls on an object. |

### Examples

```kotlin
// apply: Configure an object
val person = Person().apply {
    name = "John"
    age = 30
}

// let: Safe call and mapping
val nameLength = nullableName?.let {
    println("Processing $it")
    it.length
} ?: 0
```

## Properties & Backing Fields

In Kotlin, properties are more than just fields. They automatically generate getters and setters.

### Custom Accessors
You can define custom logic for getting or setting a property.

```kotlin
class Rectangle(val width: Int, val height: Int) {
    val isSquare: Boolean
        get() = width == height // Computed property
}
```

### Backing Fields (`field`)
When you need to refer to the property itself inside a custom setter (to avoid infinite recursion), use the `field` identifier.

```kotlin
var counter = 0
    set(value) {
        if (value >= 0) field = value // 'field' refers to the actual storage
    }
```

## Late Initialization

- `lateinit var`: Used for non-null properties that are initialized after the constructor (e.g., via Dependency Injection or Setup methods).
- `by lazy { ... }`: Thread-safe lazy initialization. The value is computed only on first access.
