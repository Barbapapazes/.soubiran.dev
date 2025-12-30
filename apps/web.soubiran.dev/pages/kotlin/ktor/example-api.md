---
id: 1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b
title: Complete Example API
description: A full example of a CRUD Task API using Ktor.
---

# Complete Example: Task API

This example demonstrates a full CRUD API for managing tasks, integrating routing, serialization, and repository patterns.

```kotlin
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import kotlinx.serialization.Serializable

@Serializable
data class Task(val id: Int, val name: String, val completed: Boolean = false)

@Serializable
data class CreateTaskRequest(val name: String)

// In-memory repository
object TaskRepository {
    private val tasks = mutableListOf<Task>()
    private var currentId = 1

    fun findAll(): List<Task> = tasks.toList()
    fun findById(id: Int): Task? = tasks.find { it.id == id }
    fun create(name: String): Task {
        val task = Task(id = currentId++, name = name)
        tasks.add(task)
        return task
    }
    fun delete(id: Int): Boolean = tasks.removeIf { it.id == id }
}

fun main() {
    embeddedServer(Netty, port = 8080) {
        install(ContentNegotiation) { json() }

        routing {
            route("/api/tasks") {
                // GET /api/tasks
                get {
                    call.respond(TaskRepository.findAll())
                }

                // GET /api/tasks/{id}
                get("/{id}") {
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@get call.respond(HttpStatusCode.BadRequest)

                    val task = TaskRepository.findById(id)
                        ?: return@get call.respond(HttpStatusCode.NotFound)

                    call.respond(task)
                }

                // POST /api/tasks
                post {
                    val request = call.receive<CreateTaskRequest>()
                    val task = TaskRepository.create(request.name)
                    call.respond(HttpStatusCode.Created, task)
                }

                // DELETE /api/tasks/{id}
                delete("/{id}") {
                    val id = call.parameters["id"]?.toIntOrNull()
                        ?: return@delete call.respond(HttpStatusCode.BadRequest)

                    if (TaskRepository.delete(id)) {
                        call.respond(HttpStatusCode.NoContent)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                }
            }
        }
    }.start(wait = true)
}
```
