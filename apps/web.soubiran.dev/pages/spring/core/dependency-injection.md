# Dependency Injection & IoC

Spring is built around the principle of **Inversion of Control (IoC)** and **Dependency Injection (DI)**. These concepts are essential for building loosely coupled, testable, and maintainable applications.

## Inversion of Control (IoC)

In traditional programming, the custom code that you write controls the flow of execution and creates the objects it needs. With Inversion of Control, this responsibility is transferred to a framework (the Spring Container).

Instead of your application creating objects (e.g., `new UserService()`), the Spring Container creates them, manages their lifecycle, and provides them to your application when needed.

## Dependency Injection (DI)

Dependency Injection is a specific implementation of IoC. It is the process where objects define their dependencies (the other objects they work with), and the container injects those dependencies when it creates the bean.

### Constructor Injection (Recommended)
This is the preferred method. Dependencies are passed through the class constructor. It ensures that the bean is always in a valid state (fully initialized) and makes testing easier because you can simply pass mock objects to the constructor.

```java
@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
```

### Setter Injection
Dependencies are set via public setter methods. This is useful for optional dependencies that can be changed after the object is created.

## Beans

In Spring, the objects that form the backbone of your application and that are managed by the Spring IoC container are called **beans**.

### Stereotype Annotations
You can tell Spring to manage a class by annotating it with a stereotype:
- **`@Component`**: The generic stereotype for any Spring-managed component.
- **`@Service`**: Specialization of `@Component` for the service layer (business logic).
- **`@Repository`**: Specialization of `@Component` for the persistence layer (data access). It also enables automatic exception translation.
- **`@Controller`**: Specialization of `@Component` for the presentation layer (Spring MVC).

### Bean Scopes
The scope of a bean defines its lifecycle and visibility:
- **Singleton** (Default): Only one instance of the bean is created per Spring container. It is shared across the entire application.
- **Prototype**: A new instance is created every time the bean is requested.
- **Request**: A single instance is created for each HTTP request (Web-aware).
- **Session**: A single instance is created for each HTTP session (Web-aware).

## Lifecycle Hooks
You can hook into the bean lifecycle to perform custom actions:
- **`@PostConstruct`**: Annotated methods are executed after the bean has been constructed and dependencies injected. Ideal for initialization logic.
- **`@PreDestroy`**: Annotated methods are executed just before the container destroys the bean. Ideal for cleanup (closing connections, etc.).

## Annotations vs Decorators
It is important to note that Java annotations are just metadata. Unlike TypeScript decorators, they do not modify the class behavior by themselves. Spring uses **Reflection** to scan the classpath, find these annotations, and then create and manage the instances accordingly.
