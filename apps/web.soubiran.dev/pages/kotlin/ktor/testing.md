---
id: 9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f
title: Testing Ktor
description: Write integration tests for your routes using testApplication.
---

# Testing Ktor

Ktor provides a dedicated testing API to verify your application's behavior without starting a real server.

## The `testApplication` Builder

Use `testApplication` to set up a test environment. You can configure the application and use a virtual `client` to make requests.

```kotlin
@Test
fun `GET tasks returns 200`() = testApplication {
    application {
        // Configure routing/plugins here
        routing {
            get("/tasks") { call.respond(HttpStatusCode.OK) }
        }
    }
    
    val response = client.get("/tasks")
    assertEquals(HttpStatusCode.OK, response.status)
}
```

## Testing POST Requests

```kotlin
val response = client.post("/tasks") {
    contentType(ContentType.Application.Json)
    setBody("""{"name": "Test task"}""")
}
assertEquals(HttpStatusCode.Created, response.status)
```
