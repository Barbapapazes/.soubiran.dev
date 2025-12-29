---
id: 9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f
title: Operator Overloading
description: Define custom implementations for standard operators like +, -, and *.
---

# Operator Overloading

Kotlin allows you to provide custom implementations for a predefined set of operators on your own types.

## The `operator` Keyword

To overload an operator, you must mark the function with `operator`. The function name must match the specific convention for that operator (e.g., `plus` for `+`).

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.plus(other: Point): Point {
    return Point(x + other.x, y + other.y)
}

// Usage
val p1 = Point(10, 20)
val p2 = Point(30, 40)
val p3 = p1 + p2 // Calls p1.plus(p2)
```

## Common Operators

| Operator | Function Name |
| :--- | :--- |
| `+` | `plus` |
| `-` | `minus` |
| `*` | `times` |
| `/` | `div` |
| `==` | `equals` |
| `>` | `compareTo` |
| `[]` | `get` / `set` |
| `()` | `invoke` |

> [!NOTE]
> You cannot define new custom operators (like `-->`), only overload the existing ones.
