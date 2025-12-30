# Dependency Injection with Koin

> [!NOTE]
> This guide focuses on **Koin**, a pragmatic DI framework for Kotlin. For general DI concepts (Constructor Injection, IoC Containers, Service Locator), see [Dependency Injection Fundamentals](../architecture/dependency-injection.md).

## Recap

| Concept | Definition | Purpose |
|---------|------------|---------|
| **Koin** | Lightweight Kotlin DI framework | Dependency injection without code generation |
| **Module** | Group of definitions | Organize dependencies logically |
| **single** | Singleton definition | Shared instance for app lifetime |
| **factory** | Factory definition | New instance every time |
| **get()** | Resolve a component | Inject dependency into constructor |
| **startKoin** | Initialize Koin | Bootstrap the container |

---

## What is Koin?

Koin is a lightweight dependency injection framework for Kotlin developers. Unlike Dagger or Hilt, it doesn't use code generation or reflection (mostly). It uses a DSL to describe your dependencies.

### Installation

```kotlin [build.gradle.kts]
dependencies {
    implementation("io.insert-koin:koin-core:3.5.0")
    testImplementation("io.insert-koin:koin-test:3.5.0")
}
```

---

## Defining Modules

Modules are where you declare your components.

```kotlin
val appModule = module {
    // Singleton: Created once, shared everywhere
    single<TaskRepository> { InMemoryTaskRepository() }

    // Factory: Created every time it's needed
    factory { TaskService(get()) }

    // ViewModel (if using Android/Koin annotations)
    // viewModel { TaskViewModel(get()) }
}
```

### The `get()` Function

The `get()` function resolves a dependency from the container. Koin infers the type required by the constructor.

```kotlin
class TaskService(private val repository: TaskRepository)

// In module:
factory {
    // Koin sees TaskService needs TaskRepository
    // It looks for a definition of TaskRepository and injects it
    TaskService(get())
}
```

---

## Starting Koin

You need to start Koin, usually in your `main()` function or `Application` class.

```kotlin
fun main() {
    startKoin {
        // Load modules
        modules(appModule)
    }

    // Resolve components
    val service = GlobalContext.get().get<TaskService>()
    service.doSomething()
}
```

---

## Scopes

Scopes define how long an object lives.

### Standard Scopes

- **single**: Created once, lives as long as the container.
- **factory**: Created every time it is requested.
- **scoped**: Lives as long as the associated scope (e.g., an HTTP request, a user session).

```kotlin
val scopeModule = module {
    scope<RequestScope> {
        scoped { RequestData() }
    }
}
```

---

## Koin DSL

Koin uses a clean DSL to define your dependency graph.

### singleOf (Constructor Reference)

The modern, concise way to declare definitions. Koin uses Kotlin's constructor reference (`::`) to automatically find the constructor and inject dependencies.

```kotlin
// Long form (Old way)
single { TaskService(get()) }

// Short form (New way)
singleOf(::TaskService)
```

### bind (Interface Binding)

Binds an implementation to its interface so it can be injected where the interface is requested.

```kotlin
// Implementation
class InMemoryTaskRepository : TaskRepository { /* ... */ }

// Bind to interface
module {
    singleOf(::InMemoryTaskRepository) { bind<TaskRepository>() }
}

// Usage
class TaskService(private val repo: TaskRepository) // Injects InMemoryTaskRepository
```

### factory

Creates a **new instance** every time it is requested. Use for stateful objects that shouldn't be shared (e.g., MVP Presenters, some ViewModels).

```kotlin
module {
    factoryOf(::TaskValidator)
}
```

---

## Dependency Scopes

Scopes control the lifecycle of your objects.

| Scope | Description | Use Case |
|-------|-------------|----------|
| **single** | Singleton (one per app) | Repositories, API Clients, Database |
| **factory** | Prototype (new per request) | Helpers, Validators, DTOs |
| **scoped** | Custom lifecycle | User Session, HTTP Request, Activity/Fragment |

### Using Scopes

```kotlin
val sessionModule = module {
    scope<UserSession> {
        scopedOf(::ShoppingCart)
    }
}

// Usage
val session = getKoin().createScope<UserSession>("session-1")
val cart = session.get<ShoppingCart>()
session.close() // Cart is destroyed
```

---

## Parameters & Properties

### Parameter Injection

Pass runtime arguments to your factories.

```kotlin
module {
    factory { (id: String) -> UserProfile(id) }
}

// Usage
val profile = getKoin().get<UserProfile> { parametersOf("user-123") }
```

### Property Injection

Inject configuration values from files or environment.

```kotlin
module {
    single {
        Database(url = getProperty("db.url"))
    }
}

// Start Koin with properties
startKoin {
    properties(mapOf("db.url" to "jdbc:h2:mem:test"))
    modules(appModule)
}
```

---

## Testing with Koin

Koin provides the `KoinTest` interface and `koin-test` library for easy testing.

### Unit Testing with Koin

```kotlin
class TaskServiceTest : KoinTest {

    // Lazy inject
    private val service by inject<TaskService>()

    @Test
    fun `test service`() {
        // Start Koin for this test
        startKoin {
            modules(module {
                singleOf(::FakeTaskRepository) { bind<TaskRepository>() }
                singleOf(::TaskService)
            })
        }

        service.doSomething()

        // Cleanup
        stopKoin()
    }
}
```

### Mocking in Tests

You can easily swap real implementations with Mocks.

```kotlin
@Test
fun `test with mockk`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)

    startKoin {
        modules(module {
            single { mockRepo }
            singleOf(::TaskService)
        })
    }

    val service = getKoin().get<TaskService>()
    service.createTask("Test")

    verify { mockRepo.save(any()) }
}
```

---

## Complete Example: Task Management System

```kotlin
// Domain layer
interface TaskRepository {
    fun save(task: Task)
    fun findAll(): List<Task>
    fun findById(id: Int): Task?
}

interface NotificationService {
    fun send(message: String)
}

// Implementation layer
class InMemoryTaskRepository : TaskRepository {
    private val tasks = mutableListOf<Task>()

    override fun save(task: Task) {
        tasks.add(task)
    }

    override fun findAll(): List<Task> = tasks.toList()

    override fun findById(id: Int): Task? = tasks.find { it.id == id }
}

class ConsoleNotificationService : NotificationService {
    override fun send(message: String) {
        println("📬 Notification: $message")
    }
}

// Business logic layer
class TaskService(
    private val repository: TaskRepository,
    private val notifier: NotificationService
) {
    fun createTask(name: String): Task {
        val task = Task(id = generateId(), name = name)
        repository.save(task)
        notifier.send("Task created: $name")
        return task
    }

    fun getTasks(): List<Task> = repository.findAll()
}

// DI Configuration
val appModule = module {
    singleOf(::InMemoryTaskRepository) { bind<TaskRepository>() }
    singleOf(::ConsoleNotificationService) { bind<NotificationService>() }
    singleOf(::TaskService)
}

// Application
fun main() {
    startKoin {
        modules(appModule)
    }

    val service = getKoin().get<TaskService>()

    service.createTask("Learn Dependency Injection")
    service.createTask("Build amazing apps")

    println("\nAll tasks:")
    service.getTasks().forEach { task ->
        println("- ${task.name}")
    }
}
```

**Output**:
```
📬 Notification: Task created: Learn Dependency Injection
📬 Notification: Task created: Build amazing apps

All tasks:
- Learn Dependency Injection
- Build amazing apps
```

---

## Common Patterns

### Repository Pattern with DI

```kotlin
module {
    single { DatabaseConnection() }
    singleOf(::TaskRepositoryImpl) { bind<TaskRepository>() }
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

### Service Layer with DI

```kotlin
module {
    // Repositories
    singleOf(::TaskRepositoryImpl) { bind<TaskRepository>() }

    // Services depend on repositories
    singleOf(::TaskService)
    singleOf(::UserService)

    // Controllers depend on services
    singleOf(::TaskController)
}
```

### Multi-Tenant Configuration

```kotlin
scope<Tenant> {
    scoped { TenantDatabase(get()) }
    scoped { TenantTaskRepository(get()) }
}

// Usage
val tenantScope = getKoin().createScope<Tenant>("tenant-${tenantId}")
val repo = tenantScope.get<TenantTaskRepository>()
```

---

## Best Practices

### 1. Prefer Constructor Injection

```kotlin
// ✅ GOOD: Dependencies are explicit
class TaskService(
    private val repository: TaskRepository
)

// ❌ BAD: Hidden dependency, harder to test
class TaskService {
    private val repository by inject<TaskRepository>()
}
```

### 2. Use Interfaces for Abstraction

```kotlin
// ✅ GOOD: Depend on abstraction
module {
    singleOf(::PostgresTaskRepository) { bind<TaskRepository>() }
}

// ❌ BAD: Depend on concrete class
module {
    singleOf(::PostgresTaskRepository)
}
```

### 3. Keep Modules Focused

```kotlin
// ✅ GOOD: Organized by layer
val dataModule = module { /* repositories */ }
val serviceModule = module { /* services */ }
val apiModule = module { /* controllers */ }

// ❌ BAD: Everything in one module
val appModule = module {
    // 100 lines of mixed concerns
}
```

### 4. Avoid Circular Dependencies

```kotlin
// ❌ BAD: A depends on B, B depends on A
class TaskService(private val userService: UserService)
class UserService(private val taskService: TaskService)

// ✅ GOOD: Extract shared logic
class TaskService(private val sharedLogic: SharedService)
class UserService(private val sharedLogic: SharedService)
```

---

## Koin vs Other DI Frameworks

| Feature | Koin | Dagger | Spring |
|---------|------|--------|--------|
| **Code Generation** | No | Yes | No |
| **Reflection** | Minimal | No | Yes |
| **Kotlin-First** | ✅ | ❌ | ❌ |
| **Learning Curve** | Low | High | Medium |
| **Compile-Time Safety** | ❌ | ✅ | ❌ |
| **Runtime Performance** | Fast | Fastest | Slower |
| **DSL** | ✅ | ❌ | Partial |

**Choose Koin When**: Building Kotlin applications prioritizing simplicity and readability.

---

## References

- [Koin Official Documentation](https://insert-koin.io/)
- [Koin GitHub Repository](https://github.com/InsertKoinIO/koin)
- [Dependency Injection Principles (Martin Fowler)](https://martinfowler.com/articles/injection.html)

---

## Next Steps

- Apply DI in [Ktor Applications](ktor.md)
- Structure projects with [Clean Architecture](architecture.md)
- Test with [MockK and Koin](mockk.md)
