---
id: 6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d
title: Inline Functions
description: Optimize higher-order functions by inlining lambda bodies at the call site.
---

# Inline Functions

Using higher-order functions (passing functions as parameters) imposes a runtime penalty: each function is an object, and a closure captures a scope.

## The `inline` Keyword

The `inline` modifier tells the compiler to copy the code of the function body **and** the lambda passed to it directly into the call site, rather than creating a function object.

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T {
    lock.lock()
    try {
        return body()
    } finally {
        lock.unlock()
    }
}
```

## When to Use

- **Use** for higher-order functions that take lambdas, especially if they are called frequently (like `forEach`, `map`, `lock`).
- **Avoid** for large functions (increases bytecode size) or functions that don't accept lambdas.

## Non-local Returns

A side effect of inlining is that you can `return` from the lambda to exit the enclosing function, which is not possible in regular lambdas.

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // Returns from hasZeros, not just the lambda
    }
    return false
}
```
