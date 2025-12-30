---
id: 4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a
title: Request Parameters
description: Learn how to extract data from URL paths and query strings.
---

# Request Parameters

Ktor makes it easy to access parameters passed in the URL.

## Path Parameters

Path parameters are defined in the route path using curly braces `{param}`. Access them via `call.parameters`.

```kotlin
get("/tasks/{id}") {
    val id = call.parameters["id"]
    call.respondText("Task ID: $id")
}
```

### Optional Parameters
Use `?` to mark a parameter as optional.

```kotlin
get("/tasks/{id?}") {
    val id = call.parameters["id"] ?: "No ID"
    call.respondText("Task ID: $id")
}
```

## Query Parameters

Query parameters (e.g., `?status=active`) are also accessed via `call.parameters`.

```kotlin
get("/tasks") {
    val status = call.parameters["status"]
    val limit = call.parameters["limit"]?.toIntOrNull() ?: 10

    call.respondText("Status: $status, Limit: $limit")
}
```

> [!TIP]
> Always validate and convert parameters (e.g., `toIntOrNull()`) as they are strings by default.
