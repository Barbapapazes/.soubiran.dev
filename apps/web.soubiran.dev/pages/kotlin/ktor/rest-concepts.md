---
id: 7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d
title: REST API Design
description: Understand the principles of REST and how to map them to Ktor routes.
---

# REST API Design

**REST** (Representational State Transfer) is an architectural style for designing networked applications.

## Core Principles

1.  **Resource-Based**: Everything is a resource identified by a URL (e.g., `/tasks`).
2.  **Stateless**: Each request contains all necessary information.
3.  **Standard Methods**: Use HTTP methods consistently.

## Mapping Methods to Actions

| HTTP Method | URL | Action | Success Status |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | List all tasks | 200 OK |
| **GET** | `/tasks/{id}` | Get a specific task | 200 OK |
| **POST** | `/tasks` | Create a new task | 201 Created |
| **PUT** | `/tasks/{id}` | Update/Replace a task | 200 OK |
| **DELETE** | `/tasks/{id}` | Delete a task | 204 No Content |

## Example Structure

```kotlin
route("/api/tasks") {
    get { /* List */ }
    post { /* Create */ }

    route("/{id}") {
        get { /* Get One */ }
        put { /* Update */ }
        delete { /* Delete */ }
    }
}
```
