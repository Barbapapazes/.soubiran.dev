---
id: 8e9f0a1b-2c3d-4e5f-6a7b-8c9d0e1f2a3b
title: Advanced Extensions
description: Explore advanced extension capabilities including generic extensions, extension properties, and nullable receivers.
---

# Advanced Extensions

Extensions in Kotlin are versatile and can be applied to generic types, properties, and even nullable types.

## Extending Generic Collections

You can define extensions on generic types like `List<T>`. This allows you to add functionality to specific kinds of collections.

```kotlin
// Only available on List<Task>
fun List<Task>.tasksAsRows(): String =
    this.joinToString("\n") { it.taskAsRow() }
```

This function will not be available on a `List<String>`, ensuring type safety.

## Extension Properties

Just like functions, you can define extension properties. Since extensions don't actually add fields to the class, these properties **cannot have a backing field** and must define a custom getter.

```kotlin
val String.wordCount: Int
    get() = this.split(" ").size

// Usage
"Hello Kotlin World".wordCount // 3
```

## Nullable Receivers

Extensions can be defined on nullable types (`T?`). This allows you to handle `null` gracefully inside the extension, often eliminating the need for safe calls (`?.`) at the call site.

```kotlin
fun String?.isNullOrEmail(): Boolean {
    // 'this' can be null here
    if (this == null) return false
    return this.contains("@")
}

// Usage
val email: String? = null
email.isNullOrEmail() // false (safe to call on null)
```

This pattern is used in the standard library, e.g., `String?.isNullOrEmpty()`.
