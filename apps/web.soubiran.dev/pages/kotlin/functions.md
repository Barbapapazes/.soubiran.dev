---
id: 5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b
title: Functions
description: Comprehensive guide to functions in Kotlin, from basic declarations to advanced features like extensions and lambdas.
---

# Functions

Kotlin functions are first-class citizens and support a wide range of features to make code concise and expressive.

## Core Concepts

- [**Declaration**](functions/declaration.md): `fun` keyword, return types, and single-expression syntax.
- [**Parameters**](functions/parameters.md): Default values and named arguments.

## Extension Functions

Extend existing classes without inheritance.

- [**Basics**](functions/extension-functions.md): Adding methods to classes you don't own.
- [**Resolution & Priority**](functions/extension-resolution.md): Static dispatch and member conflict rules.
- [**Advanced**](functions/advanced-extensions.md): Generic, property, and nullable extensions.

## Functional Programming

- [**Higher-Order Functions**](functions/higher-order-functions.md): Functions as parameters and lambdas.
- [**Function Literals with Receiver**](functions/function-literals-with-receiver.md): The magic behind DSLs and `apply`.
- [**Inline Functions**](functions/inline-functions.md): Performance optimization for lambdas.
- [**Tail Recursion**](functions/tail-recursion.md): Safe recursion with `tailrec`.

## Other Features

- [**Infix Functions**](functions/infix-functions.md): Readable syntax like `2 times "Bye"`.
- [**Operator Overloading**](functions/operator-overloading.md): Custom behavior for `+`, `-`, etc.
