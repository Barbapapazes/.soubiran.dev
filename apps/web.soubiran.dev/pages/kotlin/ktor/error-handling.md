---
id: 8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e
title: Error Handling
description: Manage exceptions gracefully using the StatusPages plugin.
---

# Error Handling

Instead of wrapping every route in `try-catch` blocks, Ktor provides the `StatusPages` plugin for global exception handling.

## Installation

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respond(HttpStatusCode.InternalServerError, "Error: ${cause.message}")
    }
    
    exception<NotFoundException> { call, cause ->
        call.respond(HttpStatusCode.NotFound, "Resource not found")
    }
}
```

## Benefits

- **Centralized Logic**: Handle errors in one place.
- **Cleaner Routes**: Keep your route handlers focused on the happy path.
- **Consistent Responses**: Ensure all errors return a standard format.
