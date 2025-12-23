# Notable Keywords & Features

Kotlin introduces several keywords and features that make it distinct and powerful compared to Java.

## Variables

- `val`: Read-only (immutable) reference. Similar to `final` in Java.
- `var`: Mutable reference.

## Classes & Objects

- `data class`: Automatically generates `equals()`, `hashCode()`, `toString()`, and `copy()`.
    - **Destructuring**: Data classes support destructuring: `val (name, age) = person`.
    - **Copying**: Use `.copy(age = 31)` to create a new instance with modified properties.
- `sealed class / interface`: Restricted class hierarchies.
    - **Exhaustive `when`**: The compiler ensures all possible subclasses are handled in a `when` expression, removing the need for an `else` branch.
    - **State Management**: Ideal for representing UI states or Result types (`Success`, `Error`, `Loading`).
- `object`: Declares a Singleton.
- `companion object`: Similar to `static` members in Java, but it's a real object.

## Functions

See the dedicated [Functions & Lambdas](/kotlin/functions) page for more details.

- `fun`: Keyword to declare a function.
- `extension functions`: Ability to extend a class with new functionality without inheriting from it.
- `inline`: Tells the compiler to inline the function body at the call site (useful for higher-order functions).
- `suspend`: Marks a function as a coroutine, allowing it to be paused and resumed.

## Property Delegation

- `by lazy { ... }`: Computed only on first access.
- `lateinit var`: Promise to initialize the variable before use (only for mutable properties).

## Control Flow

- `when`: A more powerful version of `switch`. It can be used as an expression.
- `if` as an expression: `val max = if (a > b) a else b`.

## Null Safety

- `?`: Marks a type as nullable (e.g., `String?`).
- `!!`: Not-null assertion operator (throws NPE if null).
- `?.`: Safe call operator.
- `?:`: Elvis operator (provides a default value if null).
