---
id: 604fa5fe-e0be-41d9-b699-b3862a3c52d3
title: Data Class
description:
---

Kotlin's `data class` is a concise way to create classes that primarily hold data. By using the `data` keyword, Kotlin automatically generates several useful methods for you, such as `equals()`, `hashCode()`, `toString()`, and `copy()`, based on the properties defined in the primary constructor.

A data class must have at least one property defined in the primary constructor. Here's an example:

```kotlin
data class Person(val name: String, val age: Int)
```

> [!NOTE]
> Property in the primary constructor are used for generating the methods. Properties defined inside the class body are not considered.

## Generated Methods

When you declare a data class, Kotlin automatically generates the following methods:

- `equals()`: Compares two instances based on their property values.
- `hashCode()`: Generates a hash code based on the property values.
- `toString()`: Returns a string representation of the object, including property names and values.
- `copy()`: Creates a new instance with the same property values, allowing you to modify specific properties. Be careful, as this is a shallow copy.
- Component functions (`component1()`, `component2()`, etc.): These functions allow for destructuring declarations.

## Business Logic

A data class can also contain additional properties and methods, just like a regular class. However, it's generally recommended to keep data classes focused on data representation.

```kotlin
data class Person(val name: String, val age: Int) {
    fun isAdult(): Boolean {
        return age >= 18
    }
}
```

You can also define an `init` block for validation or additional initialization logic.

```kotlin
data class Person(val name: String, val age: Int) {
    init {
        require(age >= 0) { "Age cannot be negative" }
    }
}
```

The `init` block is executed after the primary constructor, allowing you to enforce constraints on the properties. You can define multiple `init` blocks if needed, and they will be executed in the order they appear in the class body.
