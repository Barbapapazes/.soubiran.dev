# Layered Architecture

## Recap

| Layer | Responsibility | Contains | Dependencies |
|-------|----------------|----------|--------------|
| **Presentation** | User interface, API endpoints | Controllers, DTOs, Views | Application Layer |
| **Application** | Business workflows, use cases | Services, Commands | Domain Layer |
| **Domain** | Business logic and rules | Entities, Value Objects, Interfaces | None (pure logic) |
| **Infrastructure** | External concerns | Repositories, API clients, Database | Domain Layer |

---

## What is Layered Architecture?

Layered (or n-tier) architecture organizes code into horizontal layers where each layer has a specific responsibility and depends only on layers below it.

This is a **universal architectural pattern** applicable to any programming language or framework.

---

## The Four Layers

```
┌─────────────────────────────────────┐
│      Presentation Layer             │  ← User interface, HTTP APIs
│  (Controllers, DTOs, Views)         │
├─────────────────────────────────────┤
│      Application Layer              │  ← Business workflows, orchestration
│  (Services, Use Cases, Commands)    │
├─────────────────────────────────────┤
│      Domain Layer                   │  ← Core business logic
│  (Entities, Value Objects)          │
├─────────────────────────────────────┤
│      Infrastructure Layer           │  ← External systems
│  (Repositories, Database, APIs)     │
└─────────────────────────────────────┘
```

---

## The Dependency Rule

**Each layer can only depend on layers below it. Never upward.**

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑            ↓
   Views       Use Cases    Entities    Repositories
```

**Key Principle**: The Domain layer has **no dependencies**. Infrastructure depends on Domain through **interfaces**.

---

## Layer 1: Domain Layer

The **core** of your application. Contains business entities and rules.

### Entities

Pure data models representing business concepts.

```
Entity User:
    - id: UserId
    - email: Email
    - name: String
    - createdAt: DateTime

    method isActive(): Boolean
        return accountStatus == ACTIVE
```

### Value Objects

Immutable objects with validation.

```
ValueObject Email:
    - value: String

    constructor(value: String):
        require value.contains("@")
        this.value = value
```

### Domain Interfaces

Define contracts without implementation.

```
interface UserRepository:
    method findById(id: UserId): User?
    method save(user: User): void
    method delete(id: UserId): Boolean
```

**Characteristics**:
- No framework dependencies
- No database or HTTP concerns
- Pure business logic
- Fully testable in isolation

---

## Layer 2: Application Layer

Orchestrates business workflows. Implements use cases.

### Services

Coordinate between repositories and implement business processes.

```
class UserService:
    constructor(
        userRepository: UserRepository,
        emailService: EmailService
    )

    method registerUser(email: Email, name: String): User
        // Validate business rules
        if userRepository.existsByEmail(email):
            throw EmailAlreadyExistsError()

        // Create entity
        user = User(
            id: generateId(),
            email: email,
            name: name,
            createdAt: now()
        )

        // Persist
        userRepository.save(user)

        // Side effects
        emailService.sendWelcome(user.email)

        return user
```

### Use Cases / Commands

Specific application operations.

```
class RegisterUserUseCase:
    method execute(request: RegisterUserRequest): User
        // Orchestration logic
```

**Characteristics**:
- Contains application business logic
- Orchestrates between repositories
- Handles transactions
- Manages side effects

---

## Layer 3: Infrastructure Layer

Implements technical concerns and external integrations.

### Repository Implementations

```
class PostgresUserRepository implements UserRepository:
    constructor(database: Database)

    method findById(id: UserId): User?
        row = database.query("SELECT * FROM users WHERE id = ?", id)
        return row ? mapToUser(row) : null

    method save(user: User): void
        database.execute("""
            INSERT INTO users (id, email, name, created_at)
            VALUES (?, ?, ?, ?)
        """, user.id, user.email, user.name, user.createdAt)
```

### External API Clients

```
class SendGridEmailService implements EmailService:
    method send(email: Email, subject: String, body: String): void
        httpClient.post("https://api.sendgrid.com/v3/mail/send", {
            to: email.value,
            subject: subject,
            html: body
        })
```

**Characteristics**:
- Implements domain interfaces
- Handles persistence (SQL, NoSQL)
- Integrates external services (HTTP, SMTP)
- Framework-specific code lives here

---

## Layer 4: Presentation Layer

Handles user interaction and data transfer.

### Controllers / Handlers

```
class UserController:
    constructor(userService: UserService)

    method registerEndpoint(request: HttpRequest): HttpResponse
        // Extract data from request
        dto = parseBody(request, RegisterUserDTO)

        // Validate format
        if not dto.email or not dto.name:
            return HttpResponse(400, "Missing fields")

        // Call service
        try:
            user = userService.registerUser(
                Email(dto.email),
                dto.name
            )

            // Map to response
            response = UserResponseDTO(
                id: user.id.value,
                email: user.email.value,
                name: user.name
            )

            return HttpResponse(201, response)
        catch EmailAlreadyExistsError:
            return HttpResponse(409, "Email already exists")
```

### DTOs (Data Transfer Objects)

Objects for serializing data over HTTP.

```
DTO RegisterUserDTO:
    - email: String
    - name: String

DTO UserResponseDTO:
    - id: Integer
    - email: String
    - name: String
```

**Characteristics**:
- Handles HTTP/UI concerns
- DTOs for serialization
- Thin controllers (delegate to services)
- Maps between DTOs and Domain entities

---

## DTO vs Entity: Key Differences

| Aspect | DTO | Entity |
|--------|-----|--------|
| **Purpose** | Data transfer over API/UI | Business domain model |
| **Location** | Presentation layer | Domain layer |
| **Validation** | Format validation | Business rules |
| **Dependencies** | Serialization libs | None |
| **Mutability** | Often mutable | Immutable preferred |
| **Example** | `RegisterUserDTO` | `User` |

**Why Separate?**

1. **API Stability**: Change domain without breaking API
2. **Security**: Don't expose internal IDs or sensitive fields
3. **Flexibility**: API can have different structure than domain
4. **Versioning**: Support multiple API versions with same domain

```
// ❌ BAD: Exposing domain directly
API endpoint returns User entity with passwordHash

// ✅ GOOD: Use DTO
API endpoint returns UserResponseDTO (no passwordHash)
```

---

## Dependency Injection

Layered architecture relies on **Dependency Injection** to maintain the dependency rule.

```
// Application startup
database = PostgresDatabase()
userRepository = PostgresUserRepository(database)
emailService = SendGridEmailService()

userService = UserService(userRepository, emailService)

userController = UserController(userService)

server.register("/users", userController)
```

This allows:
- Swapping implementations without changing business logic
- Testing with fakes/mocks
- Configuration at runtime

---

## Testing Strategy by Layer

### Domain Layer

Test pure business logic with no mocks.

```
test_user_email_must_contain_at_symbol():
    expect EmailError when Email("invalid-email")
```

### Application Layer

Use fakes for repositories, mocks for external boundaries.

```
test_register_user_sends_welcome_email():
    fakeRepo = FakeUserRepository()
    mockEmail = Mock(EmailService)
    service = UserService(fakeRepo, mockEmail)

    service.registerUser(Email("user@example.com"), "Alice")

    verify mockEmail.sendWelcome was called
```

### Infrastructure Layer

Use real databases (test containers) or in-memory alternatives.

```
test_repository_saves_and_retrieves():
    testDb = InMemoryDatabase()
    repo = PostgresUserRepository(testDb)
    user = User(...)

    repo.save(user)
    retrieved = repo.findById(user.id)

    assert retrieved == user
```

### Presentation Layer

Test HTTP endpoints with test clients.

```
test_register_endpoint_returns_201():
    response = testClient.post("/users", {
        "email": "user@example.com",
        "name": "Alice"
    })

    assert response.status == 201
    assert response.body.email == "user@example.com"
```

---

## Naming Conventions

### Services

| Pattern | Example | Purpose |
|---------|---------|---------|
| `create*` | `createUser` | Create new entity |
| `update*` | `updateUser` | Modify existing entity |
| `delete*` | `deleteUser` | Remove entity |
| `get*` | `getUsers`, `getUserById` | Retrieve entities |
| `find*` | `findUsersByStatus` | Search with criteria |
| `register*` | `registerUser` | Complex creation workflow |
| `activate*` | `activateUser` | Change state |
| `process*` | `processPayment` | Execute workflow |

### Repositories

| Pattern | Example | Purpose |
|---------|---------|---------|
| `save` | `save(user)` | Create or update |
| `findById` | `findById(id)` | Get by ID |
| `findAll` | `findAll()` | Get all entities |
| `findBy*` | `findByEmail(email)` | Query by field |
| `delete` | `delete(id)` | Remove entity |
| `exists` | `existsByEmail(email)` | Check existence |
| `count` | `count()` | Count entities |

---

## Common Patterns

### Repository Pattern

Abstraction over data access.

```
interface Repository:
    method findById(id): Entity?
    method save(entity): void
    method delete(id): Boolean
```

Implementations swap without changing business logic.

### Dependency Injection Pattern

Inject dependencies via constructors.

```
class Service:
    constructor(repository: Repository, notifier: Notifier)
```

### Factory Pattern

Create complex objects.

```
class UserFactory:
    method createUser(email, name): User
        return User(
            id: generateId(),
            email: email,
            name: name,
            createdAt: now()
        )
```

---

## Best Practices

### 1. Keep Layers Focused

Each layer has one responsibility.

```
// ❌ BAD: Service handling HTTP status codes
class UserService:
    method createUser(...): HttpStatusCode
        return 201

// ✅ GOOD: Service returns domain object
class UserService:
    method createUser(...): User
        return user
```

### 2. Use Interfaces for Abstraction

```
// ✅ GOOD
interface UserRepository
class PostgresUserRepository implements UserRepository

// ❌ BAD: Direct coupling
class UserService:
    constructor(postgresRepo: PostgresUserRepository)
```

### 3. Map at Boundaries

Convert between DTOs and entities at layer boundaries.

```
// Presentation Layer
controller.register(request):
    dto = parseBody(request)
    entity = service.register(dto.toEntity())  // DTO → Entity
    response = entity.toDTO()                   // Entity → DTO
    return response
```

### 4. Don't Skip Layers

Always go through the appropriate layer.

```
// ❌ BAD: Controller calls repository directly
controller.getUsers():
    return userRepository.findAll()  // Skips application layer

// ✅ GOOD: Controller calls service
controller.getUsers():
    return userService.getUsers()
```

---

## Variations

### Hexagonal Architecture (Ports & Adapters)

Similar to layered but emphasizes **ports** (interfaces) and **adapters** (implementations).

- Domain at center
- Ports define contracts
- Adapters implement ports
- Can have multiple adapters per port

### Clean Architecture

Concentric circles with dependency pointing inward.

- Entities (center)
- Use Cases
- Interface Adapters
- Frameworks & Drivers (outer)

### Onion Architecture

Similar to Clean Architecture but emphasizes layers wrapping domain core.

**All variations share**: Domain independence and dependency inversion.

---

## When to Use Layered Architecture

### ✅ Use When:

- Building enterprise applications
- Complex business logic
- Multiple data sources
- Long-term maintainability required
- Team needs clear boundaries

### ❌ Avoid When:

- Simple CRUD applications
- Prototypes or MVPs
- Limited time/resources
- Business logic is trivial

---

## References

- [Domain-Driven Design (Eric Evans)](https://www.domainlanguage.com/ddd/)
- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Patterns of Enterprise Application Architecture (Martin Fowler)](https://martinfowler.com/books/eaa.html)

---

## Language-Specific Implementations

- **Kotlin**: [Kotlin Architecture](../kotlin/architecture.md) with Ktor and Koin
- **Java**: [Java Architecture](../java/architecture/) with Spring
- **Spring**: [Spring Boot Architecture](../spring/architecture/) with specific patterns
