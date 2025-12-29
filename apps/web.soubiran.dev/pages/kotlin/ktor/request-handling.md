---
id: 5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b
title: Request Handling
description: Handle incoming data including form parameters and JSON bodies using Content Negotiation.
---

# Request Handling

Ktor provides mechanisms to read data sent in the request body.

## Form Parameters

For `application/x-www-form-urlencoded` requests (standard HTML forms), use `receiveParameters()`.

```kotlin
post("/tasks") {
    val params = call.receiveParameters()
    val name = params["name"]
    val priority = params["priority"] ?: "LOW"
    
    call.respondText("Created: $name ($priority)")
}
```

## JSON & Content Negotiation

To handle JSON, you must install the `ContentNegotiation` plugin and a serializer (like `kotlinx.serialization`).

```kotlin
install(ContentNegotiation) {
    json()
}

@Serializable
data class TaskRequest(val name: String, val priority: String)

post("/tasks") {
    // Automatically deserializes JSON body to TaskRequest
    val request = call.receive<TaskRequest>()
    call.respondText("Created: ${request.name}")
}
```
