---
id: 6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c
title: Sending Responses
description: Learn how to send responses with appropriate HTTP status codes.
---

# Sending Responses

The `ApplicationCall` object (`call`) is used to send responses back to the client.

## Basic Responses

- `call.respondText("Hello")`: Sends plain text.
- `call.respond(obj)`: Sends an object (serialized to JSON if Content Negotiation is set up).

## HTTP Status Codes

You should always return the appropriate HTTP status code to indicate the result of the operation.

```kotlin
call.respond(HttpStatusCode.Created, task)
call.respond(HttpStatusCode.NotFound, "Task not found")
call.respond(HttpStatusCode.NoContent)
```

### Common Codes

| Code | Meaning | Usage |
| :--- | :--- | :--- |
| **200** | OK | Standard success (GET, PUT). |
| **201** | Created | Resource successfully created (POST). |
| **204** | No Content | Success but no body (DELETE). |
| **400** | Bad Request | Invalid input data. |
| **404** | Not Found | Resource does not exist. |
| **500** | Internal Error | Unexpected server failure. |
