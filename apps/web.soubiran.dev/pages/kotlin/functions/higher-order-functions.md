---
id: 7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e
title: Higher-Order Functions & Lambdas
description: Understand functions that accept other functions as parameters or return them.
---

# Higher-Order Functions & Lambdas

A **higher-order function** is a function that takes another function as a parameter or returns a function. This is a cornerstone of functional programming in Kotlin.

## Function Types

To pass a function as a parameter, you need to specify its type.
- `(Int, Int) -> Int`: A function taking two integers and returning an integer.
- `() -> Unit`: A function taking no arguments and returning nothing useful.

## Example

```kotlin
fun <T> lock(lock: Lock, body: () -> T): T {
    lock.lock()
    try {
        return body() // Execute the passed function
    } finally {
        lock.unlock()
    }
}
```

## Trailing Lambda Syntax

If the last parameter of a function is a function, you can place the lambda expression **outside** the parentheses.

```kotlin
lock(myLock) {
    // This is the body lambda
    println("Locked operation")
}
```

## The `it` Keyword

If a lambda has only one parameter, you can omit its declaration and refer to it implicitly as `it`.

```kotlin
val numbers = listOf(1, 2, 3)
numbers.map { it * 2 } // 'it' refers to the current element
```
