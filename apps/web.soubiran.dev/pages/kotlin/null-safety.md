# Null Safety in Kotlin

## Recap

| Operator | Name | Purpose | Example |
|----------|------|---------|---------|
| `?` | Nullable Type | Allows null values | `String?` |
| `!!` | Not-Null Assertion | Force unwrap (throws if null) | `value!!` |
| `?.` | Safe Call | Call method only if not null | `user?.name` |
| `?:` | Elvis Operator | Provide default for null | `name ?: "Unknown"` |
| `let` | Scope Function | Execute block if not null | `user?.let { }` |

---

## Kotlin's Null Safety System

Kotlin distinguishes between **nullable** and **non-nullable** types at compile time. This eliminates most `NullPointerException` errors.

```kotlin
// Non-nullable: Cannot be null
val name: String = "Alice"
// name = null // ❌ Compilation error

// Nullable: Can be null
val nickname: String? = null // ✅ Valid
```

---

## Nullable Types (`?`)

### Declaration

Append `?` to make a type nullable.

```kotlin
val nonNullable: String = "Hello"  // Cannot be null
val nullable: String? = null       // Can be null

val age: Int = 30          // Cannot be null
val maybeAge: Int? = null  // Can be null
```

### Using Nullable Types

You cannot directly call methods on nullable types without handling null.

```kotlin
val name: String? = getName()

// ❌ Compilation error: name might be null
// val length = name.length

// ✅ Must check for null first
if (name != null) {
    val length = name.length // Smart cast to non-null
}
```

### Smart Casts

After null check, Kotlin automatically casts to non-null type.

```kotlin
fun process(value: String?) {
    if (value != null) {
        // value is smart-cast to String (non-null)
        println(value.length)
        println(value.uppercase())
    }
}
```

---

## Safe Call Operator (`?.`)

Calls a method or accesses a property only if the receiver is not null. Returns `null` otherwise.

```kotlin
val user: User? = getUser()

// Without safe call
val name: String? = if (user != null) user.name else null

// With safe call
val name: String? = user?.name
```

### Chaining Safe Calls

```kotlin
data class Address(val street: String, val city: String)
data class User(val name: String, val address: Address?)

val user: User? = getUser()

// Chain multiple safe calls
val city: String? = user?.address?.city
```

**Result**: If any part is `null`, the entire expression returns `null`.

```kotlin
val user: User? = null
val city = user?.address?.city // city = null
```

### Safe Calls with Methods

```kotlin
val text: String? = getText()

// Call method only if not null
val uppercase: String? = text?.uppercase()
val length: Int? = text?.length
```

---

## Elvis Operator (`?:`)

Provides a default value when the left side is `null`.

```kotlin
val name: String? = getName()

// Without Elvis
val displayName: String = if (name != null) name else "Anonymous"

// With Elvis
val displayName: String = name ?: "Anonymous"
```

### Combining Safe Call and Elvis

```kotlin
val user: User? = getUser()

// Get name or default
val name: String = user?.name ?: "Unknown"

// Get length or default
val length: Int = user?.name?.length ?: 0
```

### Early Return with Elvis

```kotlin
fun process(user: User?) {
    val name = user?.name ?: run {
        println("User or name is null")
        return
    }
    
    // Continue with non-null name
    println("Processing: $name")
}

// More concise with early return
fun process(user: User?) {
    val name = user?.name ?: return
    println("Processing: $name")
}
```

---

## Not-Null Assertion (`!!`)

Forces conversion from nullable to non-null. **Throws `NullPointerException` if null**.

```kotlin
val name: String? = getName()

// ⚠️ Throws NPE if name is null
val length: Int = name!!.length
```

### When to Use `!!`

Use sparingly and only when you're **absolutely certain** the value is not null.

```kotlin
// ✅ GOOD: Value guaranteed not null by business logic
fun initializeApp() {
    val config = loadConfig() // Cannot be null based on app lifecycle
    val dbUrl = config!!.databaseUrl
}

// ❌ BAD: Lazy error handling
fun processUser(user: User?) {
    val name = user!!.name // Will crash if user is null
}

// ✅ BETTER: Explicit error handling
fun processUser(user: User?) {
    val name = user?.name ?: throw IllegalArgumentException("User required")
}
```

### Debugging Tip

`!!` makes stacktraces clearer because the exception points to the exact line.

```kotlin
// ❌ BAD: Hard to debug which property was null
val result = user!!.address!!.city!!.uppercase()

// ✅ BETTER: Separate lines for clearer stacktraces
val address = user!!.address
val city = address!!.city
val result = city.uppercase()
```

---

## The `let` Scope Function

Executes a code block only if the receiver is not null.

```kotlin
val name: String? = getName()

// Without let
if (name != null) {
    println("Name: $name")
    println("Length: ${name.length}")
}

// With let
name?.let {
    println("Name: $it")
    println("Length: ${it.length}")
}
```

### Using Named Parameters

```kotlin
user?.let { user ->
    println("User: ${user.name}")
    println("Email: ${user.email}")
}
```

### Transforming Values

`let` returns the result of the lambda.

```kotlin
val length: Int? = name?.let {
    println("Processing: $it")
    it.length // Returned value
}
```

### Chaining with Elvis

```kotlin
val result: String = user?.name?.let { name ->
    "Hello, $name"
} ?: "Hello, guest"
```

---

## The `run` Scope Function

Similar to `let`, but receiver is `this` instead of `it`.

```kotlin
val user: User? = getUser()

// With let (receiver is 'it')
user?.let {
    println(it.name)
    println(it.email)
}

// With run (receiver is 'this')
user?.run {
    println(name)    // this.name
    println(email)   // this.email
}
```

### Use Case: Configuration

```kotlin
val config: Config? = loadConfig()

val dbUrl: String? = config?.run {
    println("Loading database config")
    database.url
}
```

---

## The `apply` Scope Function

Configures an object and returns it. Receiver is `this`.

```kotlin
val user: User? = getUser()

user?.apply {
    name = "Updated Name"
    email = "new@example.com"
    save()
}
// Returns user (after modifications)
```

---

## Comparison: `let`, `run`, `apply`

| Function | Receiver | Return Value | Use Case |
|----------|----------|--------------|----------|
| `let` | `it` | Lambda result | Transform value, execute block |
| `run` | `this` | Lambda result | Execute block, access properties |
| `apply` | `this` | Receiver object | Configure object, builder pattern |

```kotlin
val user: User? = getUser()

// let: Transform to different type
val greeting: String? = user?.let { "Hello, ${it.name}" }

// run: Execute multiple operations
val isValid: Boolean? = user?.run {
    name.isNotBlank() && email.contains("@")
}

// apply: Modify and return
val updated: User? = user?.apply {
    lastLoginAt = Clock.System.now()
}
```

---

## Null Checks Best Practices

### 1. Prefer Safe Calls Over Manual Checks

```kotlin
// ❌ BAD: Verbose
if (user != null) {
    if (user.address != null) {
        println(user.address.city)
    }
}

// ✅ GOOD: Concise
println(user?.address?.city)
```

### 2. Use Elvis for Defaults

```kotlin
// ❌ BAD: Repetitive
val name = if (user != null && user.name != null) user.name else "Unknown"

// ✅ GOOD: Clear intent
val name = user?.name ?: "Unknown"
```

### 3. Avoid `!!` in Production Code

```kotlin
// ❌ BAD: Will crash
fun getUsername(user: User?): String {
    return user!!.name
}

// ✅ GOOD: Explicit handling
fun getUsername(user: User?): String {
    return user?.name ?: throw IllegalArgumentException("User required")
}

// ✅ BETTER: Return nullable
fun getUsername(user: User?): String? {
    return user?.name
}
```

### 4. Use `let` for Non-Null Blocks

```kotlin
// ❌ BAD: Unnecessary variable
val user = getUser()
if (user != null) {
    val u = user
    println(u.name)
    saveUser(u)
}

// ✅ GOOD: Direct execution
getUser()?.let { user ->
    println(user.name)
    saveUser(user)
}
```

### 5. Early Return for Guard Clauses

```kotlin
// ❌ BAD: Nested if statements
fun processUser(user: User?) {
    if (user != null) {
        if (user.name != null) {
            // ... many lines of code
        }
    }
}

// ✅ GOOD: Early return
fun processUser(user: User?) {
    val name = user?.name ?: return
    
    // ... many lines of code with guaranteed non-null name
}
```

---

## Platform Types from Java

When calling Java code, Kotlin doesn't know if a value is nullable. These are **platform types** (`Type!`).

```kotlin
// Java method
public String getName() { return null; } // No @Nullable annotation

// Kotlin usage
val name: String = javaObject.getName() // Runtime NPE if null!
val safeName: String? = javaObject.getName() // Safe
```

**Best Practice**: Treat platform types as nullable until proven otherwise.

```kotlin
// ✅ GOOD: Assume nullable
val name: String? = javaObject.getName()
val displayName = name ?: "Unknown"
```

---

## Nullable Collections

Collections can be nullable, and elements can be nullable.

```kotlin
// Nullable list (the list itself can be null)
val list: List<String>? = getList()

// List of nullable strings (list exists, elements can be null)
val list: List<String?> = listOf("Alice", null, "Bob")

// Both nullable
val list: List<String?>? = getMaybeList()
```

### Filtering Nulls

```kotlin
val names: List<String?> = listOf("Alice", null, "Bob", null)

// Remove nulls
val nonNullNames: List<String> = names.filterNotNull()
// Result: ["Alice", "Bob"]
```

### Safe Iteration

```kotlin
val users: List<User>? = getUsers()

// Safe iteration
users?.forEach { user ->
    println(user.name)
}
```

---

## Common Patterns

### Pattern 1: Fallback Chain

```kotlin
val name = user?.preferredName ?: user?.legalName ?: "Anonymous"
```

### Pattern 2: Validation

```kotlin
fun validateUser(user: User?): Boolean {
    return user?.name?.isNotBlank() == true &&
           user.email?.contains("@") == true
}
```

### Pattern 3: Mapping Nullables

```kotlin
val userIds: List<Int>? = users?.map { it.id }
```

### Pattern 4: Nested Null Handling

```kotlin
data class Company(val name: String, val ceo: User?)
data class User(val name: String, val email: String?)

val company: Company? = getCompany()

// Get CEO email or default
val ceoEmail: String = company?.ceo?.email ?: "no-ceo@company.com"
```

---

## Nullability Decision Tree

```
Is the value ALWAYS present?
├─ YES → Use non-nullable type (String)
└─ NO  → Is missing value an error?
         ├─ YES → Throw exception or use requireNotNull()
         └─ NO  → Use nullable type (String?)
                  ├─ Has sensible default? → Use Elvis (?:)
                  ├─ Need to transform? → Use let { }
                  └─ Need multiple operations? → Use run { }
```

---

## Complete Example

```kotlin
data class Address(val street: String, val city: String, val zipCode: String?)
data class User(val id: Int, val name: String, val email: String?, val address: Address?)

fun getUserSummary(user: User?): String {
    // Early return if user is null
    val u = user ?: return "No user provided"
    
    // Get email or default
    val email = u.email ?: "no-email@example.com"
    
    // Get city with safe navigation, or default
    val city = u.address?.city ?: "Unknown City"
    
    // Get zip code only if address exists
    val zipInfo = u.address?.zipCode?.let { zip ->
        " (ZIP: $zip)"
    } ?: ""
    
    return """
        User: ${u.name}
        Email: $email
        Location: $city$zipInfo
    """.trimIndent()
}

// Usage
println(getUserSummary(User(1, "Alice", "alice@example.com", Address("Main St", "NYC", "10001"))))
// User: Alice
// Email: alice@example.com
// Location: NYC (ZIP: 10001)

println(getUserSummary(User(2, "Bob", null, null)))
// User: Bob
// Email: no-email@example.com
// Location: Unknown City

println(getUserSummary(null))
// No user provided
```

---

## References

- [Kotlin Null Safety Documentation](https://kotlinlang.org/docs/null-safety.html)
- [Scope Functions Guide](https://kotlinlang.org/docs/scope-functions.html)

---

## Next Steps

- Learn [Scope Functions](scope-functions.md) in depth
- Explore [Extension Functions](functions.md#extension-functions)
- Apply in [Ktor APIs](ktor.md) for robust error handling
