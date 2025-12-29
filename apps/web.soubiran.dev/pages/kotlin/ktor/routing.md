---
id: 3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f
title: Routing Basics
description: Understand how to define routes, handle HTTP methods, and group related paths.
---

# Routing Basics

Routing is the core mechanism for mapping incoming HTTP requests to specific handler functions.

## The `routing` Block

All routes are defined within a `routing { ... }` block, which is installed as a plugin in your application.

```kotlin
routing {
    get("/hello") {
        call.respondText("Hello, World!")
    }
}
```

## HTTP Methods

Ktor provides builder functions for standard HTTP methods:

```kotlin
routing {
    get("/tasks") { /* List tasks */ }
    post("/tasks") { /* Create task */ }
    put("/tasks/{id}") { /* Update task */ }
    delete("/tasks/{id}") { /* Delete task */ }
}
```

## Route Grouping

You can group related routes under a common path prefix using the `route` function. This avoids repetition and organizes your code.

```kotlin
routing {
    route("/api/tasks") {
        get { /* GET /api/tasks */ }
        post { /* POST /api/tasks */ }
        
        route("/{id}") {
            get { /* GET /api/tasks/{id} */ }
            delete { /* DELETE /api/tasks/{id} */ }
        }
    }
}
```
