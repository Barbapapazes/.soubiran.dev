---
id: 9b1c8d2e-3f4a-5b6c-7d8e-9f0a1b2c3d4e
title: Function Declaration
description: Learn how to declare functions in Kotlin, including standard blocks and single-expression syntax.
---

# Function Declaration

Functions are the building blocks of Kotlin code. They are declared using the `fun` keyword.

## Standard Declaration

A standard function declaration includes the name, parameters, return type, and a body enclosed in curly braces.

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}
```

## Single-Expression Functions

When a function body consists of a single expression, you can omit the curly braces and the return type (it will be inferred). This syntax is concise and readable for simple operations.

```kotlin
fun add(a: Int, b: Int) = a + b
```

This is equivalent to the standard declaration above but reduces boilerplate.

## Key Points

- **Keyword**: `fun`
- **Return Type**: Optional in single-expression functions (inferred).
- **Unit**: If a function does not return a useful value, its return type is `Unit` (similar to `void` in Java), which can be omitted.
