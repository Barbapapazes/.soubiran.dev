# Scope Functions in Kotlin

## Recap

| Function | Receiver | Return Value | Primary Use |
|----------|----------|--------------|-------------|
| `let` | `it` | Lambda result | Transform, null-safety, temporary scope |
| `run` | `this` | Lambda result | Execute block, compute value |
| `with` | `this` | Lambda result | Group operations on object |
| `apply` | `this` | Receiver object | Configure object, builder pattern |
| `also` | `it` | Receiver object | Side effects, logging, chaining |

---

## What are Scope Functions?

Scope functions execute a block of code in the context of an object. They create a **temporary scope** for that object.

Kotlin has five standard scope functions: `let`, `run`, `with`, `apply`, and `also`.

---

## The Two Key Differences

### 1. How the Object is Referenced

- **`this`**: Object as receiver (accessible without qualifier)
- **`it`**: Object as lambda argument (must use `it.property`)

### 2. What the Function Returns

- **Lambda result**: Returns the last expression in the block
- **Context object**: Returns the object itself (for chaining)

---

## Decision Tree

```
Do you need the return value?
├─ YES → Will you transform the object?
│        ├─ YES → Use `let` (null-safety + transform)
│        └─ NO  → Use `run` or `with` (compute from properties)
│
└─ NO  → Are you configuring the object?
         ├─ YES → Use `apply` (builder pattern)
         └─ NO  → Use `also` (side effects, logging)
```

---

## `let` - Transform and Execute

### Signature

```kotlin
inline fun <T, R> T.let(block: (T) -> R): R
```

### Characteristics

- **Receiver**: `it` (lambda argument)
- **Returns**: Result of the lambda
- **Use when**: Transforming values, null-safe calls, limiting scope

### Basic Usage

```kotlin
val name = "Alice"

val greeting = name.let {
    "Hello, $it!"
}
// greeting = "Hello, Alice!"
```

### Null Safety

Most common use case: execute code only if value is not null.

```kotlin
val user: User? = getUser()

user?.let {
    println("User: ${it.name}")
    println("Email: ${it.email}")
}
// Executed only if user is not null
```

### Transformation Chain

```kotlin
val length: Int? = getUserName()
    ?.let { it.trim() }
    ?.let { it.uppercase() }
    ?.let { it.length }
```

### Limiting Variable Scope

```kotlin
// Without let: variable pollutes outer scope
val numbers = listOf(1, 2, 3, 4, 5)
val evenNumbers = numbers.filter { it % 2 == 0 }
val doubled = evenNumbers.map { it * 2 }
// evenNumbers is still accessible here (may be unintended)

// With let: temporary variable contained
val result = listOf(1, 2, 3, 4, 5).let { numbers ->
    val evenNumbers = numbers.filter { it % 2 == 0 }
    evenNumbers.map { it * 2 }
}
// evenNumbers not accessible here
```

---

## `run` - Execute and Return Result

### Signature

```kotlin
inline fun <T, R> T.run(block: T.() -> R): R
```

### Characteristics

- **Receiver**: `this` (implicit receiver)
- **Returns**: Result of the lambda
- **Use when**: Computing a value from object's properties

### Basic Usage

```kotlin
val user = User("Alice", "alice@example.com")

val summary = user.run {
    "Name: $name, Email: $email" // `this.` is implicit
}
```

### Computing from Properties

```kotlin
data class Rectangle(val width: Int, val height: Int)

val rect = Rectangle(10, 20)

val area = rect.run {
    width * height // Access properties directly
}
// area = 200
```

### Combining Initialization and Computation

```kotlin
val result = DatabaseConnection().run {
    connect()
    val data = query("SELECT * FROM users")
    disconnect()
    data // Returned value
}
```

---

## `with` - Group Operations (Non-Extension)

### Signature

```kotlin
inline fun <T, R> with(receiver: T, block: T.() -> R): R
```

### Characteristics

- **Receiver**: `this` (implicit receiver)
- **Returns**: Result of the lambda
- **Not an extension**: Called as `with(object) { }`
- **Use when**: Multiple operations on the same object

### Basic Usage

```kotlin
val user = User("Alice", "alice@example.com")

val description = with(user) {
    "Name: $name\n" +
    "Email: $email\n" +
    "Active: ${isActive()}"
}
```

### Configuring Objects

```kotlin
val config = Config()

with(config) {
    host = "localhost"
    port = 8080
    enableSSL = true
    validate()
}
```

### When to Use `with` vs `run`

```kotlin
// Use with: when you have the object already
val user = getUser()
with(user) { /* ... */ }

// Use run: when calling on nullable or chaining
getUser()?.run { /* ... */ }
```

---

## `apply` - Configure and Return Object

### Signature

```kotlin
inline fun <T> T.apply(block: T.() -> Unit): T
```

### Characteristics

- **Receiver**: `this` (implicit receiver)
- **Returns**: The object itself
- **Use when**: Configuring objects, builder pattern

### Basic Usage

```kotlin
val user = User().apply {
    name = "Alice"
    email = "alice@example.com"
    age = 30
}
// user is fully configured
```

### Builder Pattern

```kotlin
class HttpRequest {
    var url: String = ""
    var method: String = "GET"
    val headers = mutableMapOf<String, String>()

    fun addHeader(key: String, value: String) {
        headers[key] = value
    }
}

val request = HttpRequest().apply {
    url = "https://api.example.com/users"
    method = "POST"
    addHeader("Content-Type", "application/json")
    addHeader("Authorization", "Bearer token")
}
```

### Initialization and Configuration

```kotlin
fun createUser(name: String, email: String): User {
    return User(id = generateId()).apply {
        this.name = name
        this.email = email
        this.createdAt = Clock.System.now()
        validate()
    }
}
```

### Chaining

```kotlin
val user = User()
    .apply { name = "Alice" }
    .apply { email = "alice@example.com" }
    .apply { save() }
```

---

## `also` - Side Effects and Return Object

### Signature

```kotlin
inline fun <T> T.also(block: (T) -> Unit): T
```

### Characteristics

- **Receiver**: `it` (lambda argument)
- **Returns**: The object itself
- **Use when**: Side effects (logging, validation), chaining

### Basic Usage

```kotlin
val numbers = mutableListOf(1, 2, 3)
    .also { println("Original: $it") }
    .also { it.add(4) }
    .also { println("Modified: $it") }
```

### Logging

```kotlin
fun getUser(id: Int): User {
    return repository.findById(id)
        .also { println("Fetched user: ${it.name}") }
}
```

### Validation

```kotlin
fun processUser(user: User): User {
    return user
        .also { require(it.name.isNotBlank()) { "Name required" } }
        .also { require(it.email.contains("@")) { "Valid email required" } }
}
```

### Side Effects in Chains

```kotlin
val result = fetchData()
    .also { logRequest(it) }
    .map { transform(it) }
    .also { logResponse(it) }
    .filter { isValid(it) }
```

---

## Comparison Table

| Aspect | `let` | `run` | `with` | `apply` | `also` |
|--------|-------|-------|--------|---------|--------|
| **Extension** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Receiver** | `it` | `this` | `this` | `this` | `it` |
| **Returns** | Lambda | Lambda | Lambda | Object | Object |
| **Null-safe call** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Main use** | Transform | Compute | Group ops | Configure | Side effects |

---

## Choosing the Right Function

### `let` When:

- ✅ Working with nullable values
- ✅ Transforming values
- ✅ Limiting variable scope

```kotlin
user?.let { u ->
    sendEmail(u.email)
}
```

### `run` When:

- ✅ Need to access multiple properties
- ✅ Computing a value
- ✅ Object initialization + operations

```kotlin
val isValid = user.run {
    name.isNotBlank() && email.contains("@")
}
```

### `with` When:

- ✅ Multiple operations on non-null object
- ✅ Grouping operations for readability

```kotlin
with(canvas) {
    drawLine(0, 0, 100, 100)
    drawCircle(50, 50, 25)
    save()
}
```

### `apply` When:

- ✅ Configuring/initializing objects
- ✅ Builder pattern
- ✅ Need to return the configured object

```kotlin
val config = Config().apply {
    host = "localhost"
    port = 8080
}
```

### `also` When:

- ✅ Adding side effects (logging, validation)
- ✅ Debugging in chains
- ✅ Need to return the original object

```kotlin
val user = getUser()
    .also { validate(it) }
    .also { log("Processing ${it.name}") }
```

---

## Real-World Examples

### Example 1: User Registration

```kotlin
fun registerUser(email: String, password: String): User {
    return User(id = generateId()).apply {
        this.email = email
        this.passwordHash = hashPassword(password)
        this.createdAt = Clock.System.now()
    }.also {
        repository.save(it)
    }.also {
        emailService.sendWelcomeEmail(it.email)
    }.also {
        logger.info("User registered: ${it.id}")
    }
}
```

### Example 2: Null-Safe Processing

```kotlin
fun getUserGreeting(userId: Int): String? {
    return repository.findById(userId)
        ?.let { user ->
            "Hello, ${user.name}!"
        }
}
```

### Example 3: Configuration

```kotlin
val server = HttpServer().apply {
    port = 8080
    host = "0.0.0.0"
}.also {
    it.addMiddleware(AuthMiddleware())
    it.addMiddleware(LoggingMiddleware())
}.also {
    logger.info("Server configured on ${it.host}:${it.port}")
}
```

### Example 4: Data Processing Pipeline

```kotlin
fun processOrders(orders: List<Order>): Summary {
    return orders
        .also { logger.info("Processing ${it.size} orders") }
        .filter { it.status == OrderStatus.PENDING }
        .also { logger.debug("Filtered to ${it.size} pending orders") }
        .map { it.total }
        .let { totals ->
            Summary(
                count = totals.size,
                total = totals.sum(),
                average = totals.average()
            )
        }
        .also { logger.info("Summary: $it") }
}
```

---

## Common Mistakes

### Mistake 1: Using `apply` When You Need the Result

```kotlin
// ❌ BAD: apply returns the object, not the computation
val area = rect.apply {
    width * height // This is lost!
}
// area is Rectangle, not Int

// ✅ GOOD: Use run to return the computation
val area = rect.run {
    width * height
}
// area is Int
```

### Mistake 2: Using `let` When `run` is Clearer

```kotlin
// ❌ BAD: Repetitive `it.`
user?.let {
    println(it.name)
    println(it.email)
    it.save()
}

// ✅ GOOD: Use run for cleaner property access
user?.run {
    println(name)
    println(email)
    save()
}
```

### Mistake 3: Overusing Scope Functions

```kotlin
// ❌ BAD: Nested and confusing
user?.let {
    it.address?.let { addr ->
        addr.city?.let { city ->
            println(city)
        }
    }
}

// ✅ GOOD: Use safe navigation
println(user?.address?.city)
```

### Mistake 4: Using `also` for Configuration

```kotlin
// ❌ BAD: `also` with `it` is verbose for configuration
val config = Config().also {
    it.host = "localhost"
    it.port = 8080
}

// ✅ GOOD: Use `apply` with `this`
val config = Config().apply {
    host = "localhost"
    port = 8080
}
```

---

## Performance Considerations

All scope functions are `inline`, meaning they have **zero runtime overhead**. The lambda is inlined at the call site.

```kotlin
// This code:
val result = value.let { it * 2 }

// Becomes this at bytecode level:
val result = value * 2
```

---

## Quick Reference

### When to Use Each

```kotlin
// let: Transform nullable value
val length = name?.let { it.length }

// run: Compute from object properties
val fullName = user.run { "$firstName $lastName" }

// with: Multiple operations on object
with(canvas) {
    drawLine()
    drawCircle()
}

// apply: Configure object
val config = Config().apply {
    port = 8080
}

// also: Side effects
val user = getUser().also { log(it) }
```

---

## References

- [Kotlin Scope Functions Official Docs](https://kotlinlang.org/docs/scope-functions.html)
- [When to Use Which Scope Function](https://kotlinlang.org/docs/scope-functions.html#function-selection)

---

## Next Steps

- Combine with [Null Safety](null-safety.md) for robust code
- Use in [Extension Functions](functions.md#extension-functions) for fluent APIs
- Apply in [Ktor](ktor.md) for clean route handlers
