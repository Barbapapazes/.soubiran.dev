---
id: 2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e
title: Server Setup
description: Learn how to set up a basic Ktor server using embeddedServer.
---

# Server Setup

Ktor applications can be run using an embedded server, which is simple to configure and start.

## Basic Structure

The entry point is typically the `main` function, where you configure the server engine (like Netty) and the application modules.

```kotlin
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = 8080) {
        // Application module context
        routing {
            get("/") {
                call.respondText("Hello, Ktor!")
            }
        }
    }.start(wait = true)
}
```

## Key Components

- **Engine**: The underlying web server implementation (e.g., `Netty`, `Jetty`, `CIO`).
- **Port**: The network port to listen on (default is usually 8080).
- **Module**: The lambda block where you install plugins and define routes.
- **start(wait = true)**: Starts the server and blocks the main thread so the application keeps running.
