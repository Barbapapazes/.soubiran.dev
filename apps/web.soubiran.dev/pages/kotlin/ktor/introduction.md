---
id: 1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d
title: Introduction to Ktor
description: Overview of the Ktor framework, its key features, and installation instructions.
---

# Introduction to Ktor

Ktor is an asynchronous web framework built from the ground up for Kotlin. It uses coroutines for handling requests efficiently and provides a DSL for routing, serialization, and middleware.

## Key Features

- **Lightweight & Modular**: You only include what you need.
- **Coroutines**: Built for high concurrency using Kotlin coroutines.
- **Type-Safe DSL**: Expressive routing and configuration.
- **Flexible**: Supports various engines (Netty, Jetty, CIO) and serialization formats.

## Installation

Add the necessary dependencies to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.7")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")
}
```
