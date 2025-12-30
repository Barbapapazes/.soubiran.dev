# Dependency Injection Fundamentals

## Recap

| Concept | Definition | Purpose |
|---------|------------|---------|
| **Dependency Injection (DI)** | Providing dependencies from outside rather than creating them internally | Decoupling, testability, flexibility |
| **Inversion of Control (IoC)** | Framework controls object creation and lifecycle | Reduce boilerplate, centralize configuration |
| **Container** | Registry mapping interfaces/types to implementations | Manage dependencies and their lifecycles |
| **Service Locator** | Anti-pattern where objects ask for dependencies | Hidden dependencies, harder testing |

---

## What is Dependency Injection?

**Dependency Injection (DI)** is a design pattern where objects receive their dependencies from external sources rather than creating them internally. It is a specific form of **Inversion of Control (IoC)**.

### The Problem: Tight Coupling

Without DI, classes create their own dependencies.

```java
// ❌ BAD: Hard-coded dependency
class TaskService {
    private final TaskRepository repository = new PostgresTaskRepository();

    public List<Task> getTasks() {
        return repository.findAll();
    }
}
```

**Issues**:
- **Rigid**: Cannot switch to `InMemoryTaskRepository` for testing.
- **Hard to Test**: Cannot mock the database connection.
- **Duplication**: Configuration logic is scattered across classes.

### The Solution: Injection

With DI, dependencies are provided (injected) into the class, usually via the constructor.

```java
// ✅ GOOD: Dependency injected via constructor
class TaskService {
    private final TaskRepository repository;

    // Constructor Injection
    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getTasks() {
        return repository.findAll();
    }
}
```

**Benefits**:
- **Flexible**: Can pass any implementation of `TaskRepository`.
- **Testable**: Easy to pass a mock or fake repository.
- **Clean**: Class focuses on logic, not object creation.

---

## Types of Injection

### 1. Constructor Injection (Preferred)

Dependencies are provided through the class constructor.

**Pros**:
- Ensures class is fully initialized.
- Fields can be immutable (`final` / `val`).
- Easy to see all dependencies at once.

### 2. Setter/Field Injection

Dependencies are set via public setter methods or directly into fields (often using annotations like `@Inject`).

**Pros**:
- Handles optional dependencies.
- Solves circular dependencies (sometimes).

**Cons**:
- Object might be in an invalid state (partially initialized).
- Hides dependencies (Field Injection).
- Harder to test without a framework.

---

## DI Containers

A **DI Container** (or IoC Container) is a framework that manages the creation and injection of objects.

**Responsibilities**:
1.  **Registration**: Knowing which class implements which interface.
2.  **Resolution**: Creating the object graph (resolving dependencies of dependencies).
3.  **Lifecycle Management**: Managing when objects are created and destroyed (Singleton, Prototype, Request-scoped).

**Examples**:
- **Java**: Spring, Jakarta CDI, Guice
- **Kotlin**: Koin, Kodein
- **TypeScript**: InversifyJS, NestJS

---

## Service Locator (Anti-Pattern)

A Service Locator is a global registry where classes ask for their dependencies.

```java
class TaskService {
    private final TaskRepository repository;

    public TaskService() {
        // ❌ Class asks for dependency
        this.repository = ServiceLocator.get(TaskRepository.class);
    }
}
```

**Why it's bad**:
- **Hidden Dependencies**: You can't tell what `TaskService` needs just by looking at its API.
- **Global State**: Harder to manage state between tests.
- **Runtime Errors**: If the service isn't registered, it fails at runtime, not compile time.

---

## Testing with DI

DI makes testing trivial by allowing you to substitute real implementations with Test Doubles.

```java
@Test
void testTaskService() {
    // Arrange: Create a fake dependency
    TaskRepository fakeRepo = new FakeTaskRepository();

    // Inject the fake
    TaskService service = new TaskService(fakeRepo);

    // Act & Assert
    service.createTask("Test");
    assertEquals(1, fakeRepo.count());
}
```
