# Spring MVC

Spring MVC is the web framework built on the Servlet API. It is designed around the **DispatcherServlet** that dispatches requests to handlers.

## Controllers

Controllers are the entry points of your application. They handle incoming HTTP requests and return responses.
-   **`@RestController`**: A convenience annotation that combines `@Controller` and `@ResponseBody`. It indicates that the return value of methods should be bound to the web response body (typically as JSON).
-   **Mappings**: Annotations like `@GetMapping`, `@PostMapping`, `@PutMapping`, and `@DeleteMapping` map HTTP methods and paths to specific handler methods.

## Serialization

Spring Boot uses **Jackson** by default to serialize Java objects to JSON and vice versa.
> [!IMPORTANT]
> Jackson uses getters to access properties. If your entity or DTO has private fields without public getters, Jackson will not be able to serialize them, resulting in an empty JSON object. Using Lombok's `@Getter` is a common way to ensure serializability.

## Layered Architecture

A typical Spring Web application follows a layered architecture:

1.  **Controller Layer**: Handles the HTTP request, validates input, calls the service layer, and returns the response. It should be thin and not contain business logic.
2.  **Service Layer**: Contains the business logic. It orchestrates calls to repositories and other services. It also manages transaction boundaries (`@Transactional`).
3.  **Repository Layer**: Handles data access and storage.
4.  **DTOs (Data Transfer Objects)**: Simple objects used to transfer data between layers (especially between the Controller and the outside world). Using DTOs decouples your internal domain model (Entities) from the external API contract.
