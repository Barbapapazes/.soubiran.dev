---
id: 3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f
title: Function Literals with Receiver
description: Master the syntax behind Kotlin DSLs and scope functions like apply and with.
---

# Function Literals with Receiver

Function literals with receiver are a powerful feature that combines **lambdas** with **extension functions**. They allow you to call methods on a receiver object inside a lambda without any qualifiers.

## Syntax: `T.() -> Unit`

This type represents a lambda that is an extension of type `T`. Inside the lambda, `this` refers to the instance of `T`.

| Type | Description | Access inside lambda |
| :--- | :--- | :--- |
| `(T) -> Unit` | Lambda taking `T` as an argument | `it.method()` |
| `T.() -> Unit` | Lambda with `T` as receiver | `this.method()` or just `method()` |

## Building DSLs

This feature is the foundation of Type-Safe Builders (DSLs) in Kotlin, such as HTML builders or Gradle scripts.

```kotlin
class HTML {
    fun body() { println("<body></body>") }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init() // Execute lambda with 'html' as receiver
    return html
}

// Usage
html {
    body() // Calls HTML.body() directly
}
```

## Scope Functions

Standard library functions like `apply`, `with`, and `run` use this mechanism.

```kotlin
val sb = StringBuilder().apply {
    append("Hello") // 'this' is the StringBuilder
    append(" World")
}
```
