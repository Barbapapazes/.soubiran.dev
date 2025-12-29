---
id: 4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a
title: Infix Functions
description: Learn how to create readable, natural-language-like function calls using the infix modifier.
---

# Infix Functions

Kotlin allows you to call certain functions without using the dot and parentheses, mimicking natural language or mathematical notation. This is called **infix notation**.

## Requirements

To be marked with the `infix` keyword, a function must:
1. Be a member function or an extension function.
2. Have exactly **one** parameter.
3. The parameter must not accept variable number of arguments and must have no default value.

## Example

```kotlin
infix fun Int.times(str: String) = str.repeat(this)

// Usage
val result = 2 times "Bye " 
// Result: "Bye Bye "
```

This is equivalent to calling `2.times("Bye ")`.

## Common Use Cases

Infix functions are widely used in the standard library and DSLs.
- `to` in `Map` creation: `mapOf("key" to "value")`
- Bitwise operations: `val x = 1 shl 2`
- Testing frameworks: `assertThat(result) shouldBe expected`
