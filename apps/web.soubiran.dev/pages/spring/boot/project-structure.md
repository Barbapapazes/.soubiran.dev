# Spring Boot Project Structure

A well-organized project structure is key to maintainability. While Spring Boot is flexible, following standard conventions helps other developers understand your code quickly.

## Recommended Layout

A typical layout groups classes by their technical layer:

```
com.company.project
├── Application.java          // The entry point (main class)
├── config/                   // Configuration classes (@Configuration)
├── controller/               // Web layer (REST controllers)
├── service/                  // Business logic layer
├── repository/               // Data access layer
├── model/                    // Domain objects
│   └── entity/               // Database entities (@Entity)
└── dto/                      // Data Transfer Objects
```

## Packaging Strategies

### Package by Layer
This is the structure shown above. It groups files by their technical function (Controllers, Services, Repositories).
-   **Pros**: Easy to understand for beginners.
-   **Cons**: As the project grows, related business logic gets scattered across different packages.

### Package by Feature
This groups files by the business domain they belong to (e.g., `user`, `order`, `product`).
-   **Pros**: High cohesion. Everything related to a feature is in one place. Easier to modularize or split into microservices later.
-   **Cons**: Can be harder to enforce strict layering.

**Recommendation**: Start with Package by Layer for small projects. Move to Package by Feature as the application grows into a modular monolith.
