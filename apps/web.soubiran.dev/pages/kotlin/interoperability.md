# Java Interoperability

Kotlin is designed with Java interoperability in mind. You can call Java code from Kotlin and Kotlin code from Java seamlessly.

## Calling Java from Kotlin

Most Java code can be called just like Kotlin code:

```kotlin
val list = ArrayList<String>()
list.add("Hello")
```

### Nullability in Java

Java doesn't have null safety in its type system. When calling Java from Kotlin, types are seen as **Platform Types** (`T!`). You should decide whether they are nullable or not.

## Calling Kotlin from Java

Kotlin features are mapped to Java constructs:

- **Properties**: Mapped to getter and setter methods.
- **Package-level functions**: Mapped to static methods in a class named after the file (e.g., `FileKt.function()`).
- **Default arguments**: Use `@JvmOverloads` to generate multiple overloads for Java.
- **Companion objects**: Mapped to static fields or methods. Use `@JvmStatic` to make them true static members.

## Annotations for Interop

- `@JvmName`: Changes the name of the generated Java element.
- `@JvmStatic`: Specifies that an additional static method should be generated from this element.
- `@JvmOverloads`: Instructs the Kotlin compiler to generate overloads for a function that has default parameter values.
- `@JvmField`: Instructs the Kotlin compiler not to generate getters/setters for this property and expose it as a field.
