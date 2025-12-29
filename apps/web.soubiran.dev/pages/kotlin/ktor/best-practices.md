---
id: 0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a
title: Best Practices
description: Guidelines for writing clean, maintainable Ktor applications.
---

# Best Practices

## 1. Descriptive Route Names
Use clear, noun-based resource names.
- ✅ `get("/tasks")`
- ❌ `get("/getTasks")`

## 2. Validate Input Early
Check request data immediately and return `400 Bad Request` if invalid.

```kotlin
if (request.name.isBlank()) {
    return@post call.respond(HttpStatusCode.BadRequest, "Name required")
}
```

## 3. Use Correct Status Codes
Don't just return 200 for everything. Use `201 Created`, `404 Not Found`, `204 No Content` appropriately.

## 4. Keep Handlers Thin
Avoid putting business logic directly in the route handler. Delegate to a service or controller layer.

```kotlin
// Good
post("/tasks") {
    val task = taskService.create(call.receive())
    call.respond(HttpStatusCode.Created, task)
}
```
