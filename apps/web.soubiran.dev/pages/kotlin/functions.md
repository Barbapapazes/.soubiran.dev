# Functions in Kotlin

Kotlin functions are first-class citizens, meaning they can be stored in variables and data structures, passed as arguments to and returned from other higher-order functions.

## Declaration

Functions are declared using the `fun` keyword.

```kotlin
fun add(a: Int, b: Int): Int {
    return a + b
}
```

### Single-Expression Functions
When a function returns a single expression, the curly braces can be omitted and the body is specified after a `=` symbol.

```kotlin
fun add(a: Int, b: Int): Int = a + b
```

## Parameters

### Default Arguments
Function parameters can have default values, which are used when you skip the corresponding argument. This reduces the need for overloads.

```kotlin
fun display(message: String, prefix: String = "INFO") {
    println("[$prefix] $message")
}
```

### Named Arguments
When calling a function, you can name one or more of its arguments. This is very helpful for functions with many parameters.

```kotlin
display(message = "Hello", prefix = "LOG")
```

## Special Function Types

### Extension Functions
Kotlin provides the ability to extend a class with new functionality without having to inherit from the class.

```kotlin
fun String.isEmail(): Boolean {
    return this.contains("@")
}

"test@example.com".isEmail() // returns true
```

### Choosing Between Regular and Extension Functions

Deciding whether to use a regular (member) function or an extension function depends on ownership and intent:

| Use a **Member Function** when...                            | Use an **Extension Function** when...                                    |
|:-------------------------------------------------------------|:-------------------------------------------------------------------------|
| You **own** the class and the logic is core to its identity. | You **don't own** the class (e.g., `String`, `List`, or 3rd party libs). |
| You need access to `private` or `protected` members.         | You only need access to `public` members.                                |
| The function modifies the internal state of the object.      | The function provides a "utility" or "helper" behavior.                  |
| You want to allow subclasses to `override` the behavior.     | You want to improve readability with a fluent API.                       |

> [!TIP]
> Extension functions are resolved **statically**. This means they do not actually modify the class they extend, and they cannot be overridden. If a class has a member function and an extension function with the same signature, the **member function always wins**.

### Infix Functions
Functions marked with the `infix` keyword can also be called using the infix notation (omitting the dot and the parentheses for the call). They must be member functions or extension functions and have a single parameter.

```kotlin
infix fun Int.times(str: String) = str.repeat(this)

val result = 2 times "Bye " // "Bye Bye "
```

### Higher-Order Functions & Lambdas
A higher-order function is a function that takes functions as parameters, or returns a function.

```kotlin
fun <T> lock(lock: Lock, body: (Lock) -> T): T {
  lock.lock()
  try {
    return body(lock)
  } finally {
    lock.unlock()
  }
}

// call with trailing lambda, use `it`
lock(myLock) {
  println("Locked: $it")
}
```

```kotlin
fun <T> lock(lock: Lock, body: Lock.() -> T): T {
  lock.lock()
  try {
    return lock.body()
  } finally {
    lock.unlock()
  }
}

// call with trailing lambda, use `this`
lock(myLock) {
  println("Locked: $this")
}
```
```

#### Function Literals with Receiver
This is the "magic" behind `apply`, `buildString`, and DSLs. It allows you to call methods on the receiver object inside the lambda without any qualifiers.

> [!NOTE]
> DSL: Domain-Specific Language, a specialized mini-language tailored to a specific problem domain, often implemented using function literals with receiver in Kotlin.

Inside the body of a function literal with receiver, the receiver object passed to a call becomes an **implicit `this`**.

##### Defining a Function with Receiver
To define a function that takes a lambda with a receiver, you use the syntax `ReceiverType.() -> ReturnType`.

```kotlin
// 1. Define the function
fun configure(action: StringBuilder.() -> Unit): String {
    val sb = StringBuilder()
    sb.action() // 2. Execute the lambda on the receiver
    return sb.toString()
}

// 3. Use it
val result = configure {
    append("Hello, ") // 'this' is StringBuilder
    append("World!")
}
```

##### Difference between `(T) -> Unit` and `T.() -> Unit`
- `(T) -> Unit`: The object is passed as an **argument** (usually named `it`).
- `T.() -> Unit`: The object is the **receiver** (accessible via `this`).

| Feature     | Lambda with Argument `(T) -> Unit` | Lambda with Receiver `T.() -> Unit` |
|:------------|:-----------------------------------|:------------------------------------|
| **Access**  | `it.method()`                      | `method()` or `this.method()`       |
| **Scope**   | External scope                     | Scope of `T`                        |
| **Example** | `let`, `also`                      | `apply`, `run`, `with`              |

##### Building a Simple DSL
Function literals with receiver are the foundation of Kotlin DSLs (like Ktor, Compose, or Gradle Kotlin DSL).

```kotlin
class HTML {
    fun body() { println("<body></body>") }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}

// Usage looks like a native language construct
html {
    body()
}
```

Why `apply { ... }` instead of `apply() { ... }`?
1. **Trailing Lambda**: Since the lambda is the last (and only) argument, parentheses are optional.
2. **Receiver**: The lambda is defined as `T.() -> Unit`, so inside the braces, `this` is the object `apply` was called on.

### Inline Functions
Using higher-order functions imposes certain runtime penalties. `inline` functions can be used to reduce this overhead by nesting the function body directly into the call site.

## Tail Recursive Functions (`tailrec`)
Kotlin supports a style of functional programming known as tail recursion. This allows some algorithms that would normally be written using loops to instead be written using a recursive function, but without the risk of stack overflow.

```kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

## Operator Overloading
Kotlin allows us to provide implementations for a predefined set of operators on our types. These functions must be marked with the `operator` modifier.

```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.plus(other: Point): Point {
    return Point(x + other.x, y + other.y)
}
```
