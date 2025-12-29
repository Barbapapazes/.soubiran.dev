---
id: 1f2e3d4c-5b6a-7980-1234-567890abcdef
title: Extension Functions
description: Learn how to extend existing classes with new functionality without inheritance.
---

# Extension Functions

Extension functions allow you to add new functions to existing classes (even those you don't own, like `String` or `List`) without modifying their source code or using inheritance.

## Basic Syntax

To declare an extension function, prefix the function name with the **receiver type** (the class being extended).

```kotlin
fun ReceiverType.functionName(parameters): ReturnType {
    // body
}
```

## Example: Extending String

Let's add a method to `String` to check if it looks like an email.

```kotlin
fun String.isEmail(): Boolean {
    return this.contains("@") && this.contains(".")
}

// Usage
val isValid = "test@example.com".isEmail() // true
```

## The Receiver: `this`

Inside the extension function, the keyword `this` refers to the instance of the class the function is called on (the **receiver object**).

```kotlin
fun Task.taskAsRow(): String = """
    ID: ${this.id}
    Name: ${this.name}
""".trimIndent()
```

> [!NOTE]
> You can omit `this` when accessing members of the receiver, just like in a regular member function (e.g., `ID: $id`).

## When to Use

| Use Extension Functions | Use Member Functions |
| :--- | :--- |
| Adding utility methods to classes you don't own (SDKs, libraries). | Core logic essential to the class's identity. |
| Creating helper methods that only use public APIs. | Logic requiring access to `private` or `protected` state. |
| Improving readability with fluent APIs. | Methods that need to be overridden by subclasses. |
