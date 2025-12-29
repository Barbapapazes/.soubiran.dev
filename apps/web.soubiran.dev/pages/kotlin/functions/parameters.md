---
id: a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d
title: Function Parameters
description: Understand how to use default and named arguments to create flexible and readable function calls.
---

# Function Parameters

Kotlin provides powerful features for handling function parameters, reducing the need for method overloading and improving code readability.

## Default Arguments

Function parameters can have default values. If an argument is omitted during the function call, the default value is used.

```kotlin
fun display(message: String, prefix: String = "INFO") {
    println("[$prefix] $message")
}

// Usage
display("System started") // Output: [INFO] System started
display("Error occurred", "ERROR") // Output: [ERROR] Error occurred
```

This eliminates the need to create multiple overloaded versions of the same function just to handle optional parameters.

## Named Arguments

When calling a function, you can specify arguments by their parameter name. This improves readability, especially for functions with multiple parameters or boolean flags.

```kotlin
fun reformat(str: String, normalizeCase: Boolean = true, upperCaseFirstLetter: Boolean = true, divideByCamelHumps: Boolean = false) { /*...*/ }

// Usage
reformat(
    str = "hello world",
    normalizeCase = true,
    upperCaseFirstLetter = false
)
```

### Benefits
- **Clarity**: It's obvious what each value represents.
- **Flexibility**: You can change the order of arguments (though mixing positional and named arguments requires positional ones to come first).
- **Partial Defaults**: You can skip specific arguments that have defaults while providing others.
