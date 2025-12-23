# Kotlin

Kotlin is a modern, cross-platform, statically typed programming language with type inference. It is designed to interoperate fully with Java, and the JVM version of its standard library depends on the Java Class Library, but type inference allows its syntax to be more concise.

## Strengths

- **Conciseness**: Drastically reduces boilerplate code (e.g., data classes, properties).
- **Safety**: Built-in null safety system that eliminates the infamous `NullPointerException`.
- **Interoperability**: 100% interoperable with Java. You can use Java libraries in Kotlin and vice versa.
- **Tooling**: Developed by JetBrains, it has first-class support in IntelliJ IDEA and Android Studio.
- **Multiplatform**: Can be used for JVM, Android, JavaScript, and Native (iOS, Desktop).

## Kotlin vs Java

| Feature | Java | Kotlin |
|---------|------|--------|
| **Null Safety** | `Optional` or annotations | Built-in (`String?` vs `String`) |
| **Data Classes** | Records (Java 14+) or Lombok | `data class` |
| **Extension Functions** | Not available | Supported |
| **Smart Casts** | `instanceof` + manual cast | Automatic after type check |
| **Coroutines** | Threads / Virtual Threads (Loom) | First-class Coroutines support |
| **Default Arguments** | Overloading methods | Supported in function signature |
| **Checked Exceptions** | Required | Not present (all are unchecked) |

## Key Concepts

- [Notable Keywords & Features](/kotlin/keywords)
- [Functions & Lambdas](/kotlin/functions)
- [Collections & Functional Ops](/kotlin/collections)
- [Idiomatic Kotlin](/kotlin/idiomatic-kotlin)
- [Advanced Types & Delegation](/kotlin/advanced-types)
- [Coroutines & Concurrency](/kotlin/coroutines)
- [Java Interoperability](/kotlin/interoperability)
