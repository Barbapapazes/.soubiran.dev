---
id: 2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c
title: Tail Recursive Functions
description: Write safe recursive algorithms without stack overflow risks using tail recursion.
---

# Tail Recursive Functions

Kotlin supports **tail recursion optimization**. This allows you to write algorithms recursively without the risk of `StackOverflowError`, as the compiler optimizes the recursion into a fast and efficient loop.

## The `tailrec` Keyword

To enable this optimization, mark the function with `tailrec`. The recursive call must be the **last operation** performed by the function.

```kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < 0.001) x 
    else findFixPoint(Math.cos(x))
```

## How it Works

The compiler detects that the recursive call is in the tail position (nothing is done with the result of the recursive call except returning it) and rewrites the code as a `while` loop behind the scenes.

## Limitations

- The function must call itself as the very last action.
- It cannot be used within `try`/`catch`/`finally` blocks.
