---
id: 5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d
title: Extension Resolution & Priority
description: Understand how extension functions are resolved statically and how they interact with member functions.
---

# Extension Resolution & Priority

It is crucial to understand that extension functions are **statically resolved**. They do not modify the class they extend; they are merely static utility functions that can be called with dot notation.

## Static Resolution

The function to call is determined by the **declared type** of the variable at compile time, not the runtime type of the object.

```kotlin
open class Shape
class Circle : Shape()

fun Shape.getName() = "Shape"
fun Circle.getName() = "Circle"

val shape: Shape = Circle()
println(shape.getName()) // Output: "Shape"
```

Even though `shape` holds a `Circle` at runtime, the variable type is `Shape`, so `Shape.getName()` is called. This is different from virtual method dispatch (polymorphism).

## Member vs. Extension Priority

If a class has a member function and an extension function with the **same signature**, the **member function always wins**.

```kotlin
class User(val name: String) {
    fun greet() = "Hello from member"
}

fun User.greet() = "Hello from extension"

val user = User("Alice")
println(user.greet()) // Output: "Hello from member"
```

> [!WARNING]
> You cannot override a member function with an extension function. However, you *can* overload it (e.g., by using different parameters).
