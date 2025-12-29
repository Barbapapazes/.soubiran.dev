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

## Learning Path

### Fundamentals

Start here to build a solid foundation in Kotlin syntax and concepts.

- [Notable Keywords & Features](keywords.md) - `val`, `var`, `object`, `companion`, sealed classes
- [Functions & Lambdas](functions.md) - Function types, extension functions, higher-order functions
- [Data Classes](data-class.md) - Immutable data models with built-in utilities
- [Collections & Functional Operations](collections.md) - Lists, maps, functional programming
- [Null Safety](null-safety.md) - `?`, `!!`, `?.`, `?:`, and safe navigation
- [Scope Functions](scope-functions.md) - `let`, `run`, `with`, `apply`, `also`

### Advanced Concepts

Deep dive into advanced language features and patterns.

- [Idiomatic Kotlin](idiomatic-kotlin.md) - Write Kotlin the Kotlin way
- [Advanced Types & Delegation](advanced-types.md) - Generics, sealed classes, delegation
- [Coroutines & Concurrency](coroutines.md) - Async programming with coroutines
- [Java Interoperability](interoperability.md) - Working with Java code

### Backend Development

Build web applications and APIs with Kotlin.

- [Application Architecture](architecture.md) - Layered architecture, domain/service/data/HTTP patterns
- [Ktor Web Framework](ktor.md) - REST APIs, routing, HTTP handling
- [Dependency Injection with Koin](dependency-injection.md) - IoC container, scopes, testing

### Testing

Write robust, maintainable tests for Kotlin applications.

- [Testing Fundamentals](testing.md) - AAA vs Given-When-Then, test doubles, testing strategy
- [MockK](mockk.md) - Mocking library for Kotlin with advanced features
- [Test Examples](examples/) - Complete test suites for reference

---

## Key Concepts
