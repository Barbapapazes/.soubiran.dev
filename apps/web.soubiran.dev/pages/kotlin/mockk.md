# MockK: Kotlin Mocking Library

> [!NOTE]
> This guide covers **MockK-specific syntax and features**. For general mocking concepts (Mock vs Fake vs Stub, when to use mocks, testing strategy), see [Testing Fundamentals](../testing/fundamentals.md).

## Recap

| Feature | Description | Use Case |
|---------|-------------|----------|
| **mockk()** | Creates a strict mock requiring all behavior to be defined | Precise behavior verification |
| **relaxed = true** | Creates a mock returning default values automatically | Quick prototyping, less setup |
| **every { }** | Defines mock behavior (stubbing) | Specify return values |
| **returns** | Infix function specifying return value | Readable stubbing syntax |
| **verify { }** | Verifies mock was called as expected | Behavior verification |
| **Matchers** | Flexible argument matching (any(), eq(), more()) | Complex matching scenarios |

---

## What is MockK?

MockK is a mocking library specifically designed for Kotlin. It provides idiomatic Kotlin syntax using lambdas, infix functions, and DSL patterns.

**Why MockK over Mockito?**
- Native Kotlin support (coroutines, extension functions, infix)
- Cleaner syntax with lambda-based verification
- Better handling of final classes (Kotlin default)
- Built-in support for object mocks and constructors

---

## Installation

```kotlin [build.gradle.kts]
dependencies {
    testImplementation("io.mockk:mockk:1.13.8")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.1")
}
```

---

## Basic Mocking

### Creating a Mock

```kotlin
import io.mockk.mockk

interface TaskRepository {
    fun findById(id: Int): Task?
    fun save(task: Task)
    fun count(): Int
}

@Test
fun `basic mock creation`() {
    val mockRepo = mockk<TaskRepository>()
    
    // Mock is created but has no behavior defined yet
}
```

### Strict vs Relaxed Mocks

#### Strict Mock (Default)

Throws an exception if called without defined behavior.

```kotlin
@Test
fun `strict mock requires behavior definition`() {
    val mockRepo = mockk<TaskRepository>()
    
    // ❌ This throws: no answer found for TaskRepository.count()
    // mockRepo.count()
}
```

**Use When**: You want to ensure every interaction is explicitly defined and verified.

#### Relaxed Mock

Returns default values automatically (null, 0, false, empty collections).

```kotlin
@Test
fun `relaxed mock returns defaults`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    
    // ✅ Returns 0 by default
    assertEquals(0, mockRepo.count())
    
    // ✅ Returns null by default
    assertNull(mockRepo.findById(1))
}
```

**Use When**: You only care about specific interactions and want less setup code.

---

## Stubbing with every { }

The `every { }` block defines what a mock should return when called.

### Basic Stubbing

```kotlin
@Test
fun `stub simple method`() {
    val mockRepo = mockk<TaskRepository>()
    
    // Define behavior: when count() is called, return 42
    every { mockRepo.count() } returns 42
    
    assertEquals(42, mockRepo.count())
}
```

### Stubbing with Parameters

```kotlin
@Test
fun `stub method with specific argument`() {
    val mockRepo = mockk<TaskRepository>()
    val expectedTask = Task(id = 1, name = "Test Task")
    
    // Returns task only when called with id = 1
    every { mockRepo.findById(1) } returns expectedTask
    
    assertEquals(expectedTask, mockRepo.findById(1))
    assertNull(mockRepo.findById(2)) // Throws if not relaxed
}
```

### The returns Infix Function

`returns` is an **infix function**, not a keyword. This means:

```kotlin
// ✅ Readable infix notation
every { mockRepo.count() } returns 42

// ✅ Also valid (standard function call)
every { mockRepo.count() }.returns(42)

// The first style is preferred for readability
```

---

## Argument Matchers

Matchers allow flexible argument matching without specifying exact values.

### Common Matchers

```kotlin
import io.mockk.*

@Test
fun `using argument matchers`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    val task = Task(id = 1, name = "Test")
    
    // any() - matches any value of the type
    every { mockRepo.findById(any()) } returns task
    
    // eq() - matches exact value (explicit equality)
    every { mockRepo.findById(eq(1)) } returns task
    
    // Matchers can be combined
    every { mockRepo.findById(or(eq(1), eq(2))) } returns task
}
```

### Numeric Matchers

```kotlin
@Test
fun `numeric matchers`() {
    val mockPricer = mockk<PriceCalculator>()
    
    // more() - greater than
    every { mockPricer.calculateDiscount(more(100.0)) } returns 20.0
    
    // less() - less than
    every { mockPricer.calculateDiscount(less(50.0)) } returns 5.0
    
    // between() - range matching
    every { mockPricer.calculateDiscount(more(50.0) and less(100.0)) } returns 10.0
    
    assertEquals(20.0, mockPricer.calculateDiscount(150.0))
    assertEquals(5.0, mockPricer.calculateDiscount(30.0))
}
```

### String Matchers

```kotlin
@Test
fun `string matchers`() {
    val mockValidator = mockk<Validator>()
    
    // match() - regex matching
    every { mockValidator.isValid(match { it.contains("@") }) } returns true
    
    // Custom lambda matcher
    every { mockValidator.isValid(match { it.length > 5 }) } returns true
    
    assertTrue(mockValidator.isValid("test@example.com"))
}
```

### Capturing Arguments

```kotlin
@Test
fun `capture argument for inspection`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    val slot = slot<Task>()
    
    every { mockRepo.save(capture(slot)) } returns Unit
    
    val service = TaskService(mockRepo)
    service.createTask("New Task")
    
    // Inspect captured value
    assertEquals("New Task", slot.captured.name)
}
```

---

## Behavior Verification

Verification ensures that mocks were called as expected. This is the **key difference** between mocks and stubs.

### Basic Verification

```kotlin
@Test
fun `verify method was called`() {
    val mockNotifier = mockk<EmailNotifier>(relaxed = true)
    
    val service = TaskService(mockNotifier)
    service.sendReminder("Complete your tasks")
    
    // Verify send() was called exactly once
    verify(exactly = 1) { mockNotifier.send(any()) }
}
```

### Verification Modes

```kotlin
@Test
fun `verification modes`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    
    // Called at least once
    verify(atLeast = 1) { mockRepo.save(any()) }
    
    // Called at most twice
    verify(atMost = 2) { mockRepo.save(any()) }
    
    // Never called
    verify(exactly = 0) { mockRepo.delete(any()) }
    
    // Alternative syntax for "never"
    verify { mockRepo wasNot Called }
}
```

### Verifying Specific Arguments

```kotlin
@Test
fun `verify with specific arguments`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    val task = Task(id = 1, name = "Important")
    
    val service = TaskService(mockRepo)
    service.saveTask(task)
    
    // Verify save was called with exact task
    verify { mockRepo.save(task) }
    
    // Verify with matcher
    verify { mockRepo.save(match { it.name == "Important" }) }
}
```

### Ordered Verification

Ensures methods are called in a specific sequence.

```kotlin
@Test
fun `verify call order`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    
    val service = TaskService(mockRepo)
    service.performBatchOperation()
    
    // Verify exact order
    verifyOrder {
        mockRepo.startTransaction()
        mockRepo.save(any())
        mockRepo.commitTransaction()
    }
}
```

### Sequential Verification

Verifies consecutive calls without gaps.

```kotlin
@Test
fun `verify consecutive calls`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    
    mockRepo.save(Task(id = 1, name = "First"))
    mockRepo.save(Task(id = 2, name = "Second"))
    
    // These must be consecutive with no other calls in between
    verifySequence {
        mockRepo.save(match { it.id == 1 })
        mockRepo.save(match { it.id == 2 })
    }
}
```

### Comprehensive Verification

Ensures ALL calls are accounted for.

```kotlin
@Test
fun `verify all interactions`() {
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    
    mockRepo.save(Task(id = 1, name = "Task"))
    
    // Verify ALL interactions happened
    verifyAll {
        mockRepo.save(any())
        // If there are other calls, this will fail
    }
}
```

---

## Advanced Mocking Techniques

### Mocking Extension Functions

```kotlin
// Extension function
fun Task.isOverdue(): Boolean = // ...

@Test
fun `mock extension function`() {
    val task = mockk<Task>()
    
    every { task.isOverdue() } returns true
    
    assertTrue(task.isOverdue())
}
```

### Mocking Object Singletons

```kotlin
object DatabaseConfig {
    fun getConnectionString(): String = "production-db"
}

@Test
fun `mock object singleton`() {
    mockkObject(DatabaseConfig)
    
    every { DatabaseConfig.getConnectionString() } returns "test-db"
    
    assertEquals("test-db", DatabaseConfig.getConnectionString())
    
    // Restore original behavior
    unmockkObject(DatabaseConfig)
}
```

### Mocking Constructors

```kotlin
@Test
fun `mock constructor`() {
    mockkConstructor(Task::class)
    
    every { anyConstructed<Task>().name } returns "Mocked Task"
    
    val task = Task(id = 1, name = "Real Name")
    assertEquals("Mocked Task", task.name)
    
    unmockkConstructor(Task::class)
}
```

### Partial Mocking (Spies)

```kotlin
@Test
fun `spy on real object`() {
    val realTask = Task(id = 1, name = "Real Task")
    val spy = spyk(realTask)
    
    // Mock specific method while keeping others real
    every { spy.isComplete() } returns true
    
    // Real behavior
    assertEquals("Real Task", spy.name)
    
    // Mocked behavior
    assertTrue(spy.isComplete())
}
```

---

## Common Patterns and Best Practices

### 1. Mock Only External Boundaries

```kotlin
// ✅ GOOD: Mock external dependency
@Test
fun `notify user on task completion`() {
    val mockEmailService = mockk<EmailService>(relaxed = true)
    val service = TaskService(mockEmailService)
    
    service.completeTask(taskId = 1)
    
    verify { mockEmailService.send(any()) }
}

// ❌ BAD: Mocking your own domain logic
@Test
fun `calculate task priority`() {
    val mockTask = mockk<Task>()
    val mockCalculator = mockk<PriorityCalculator>()
    
    // Too many mocks = brittle test
    every { mockTask.dueDate } returns LocalDate.now()
    every { mockCalculator.calculate(any()) } returns Priority.HIGH
}
```

### 2. Use Relaxed Mocks for Setup, Strict for Verification

```kotlin
@Test
fun `payment workflow`() {
    // Relaxed for dependencies we don't verify
    val mockRepo = mockk<TaskRepository>(relaxed = true)
    
    // Strict for critical boundaries we verify
    val mockPaymentGateway = mockk<PaymentGateway>()
    every { mockPaymentGateway.charge(any()) } returns PaymentResult.Success
    
    val service = PaymentService(mockRepo, mockPaymentGateway)
    service.processPayment(amount = 99.99)
    
    verify { mockPaymentGateway.charge(99.99) }
}
```

### 3. Reset Mocks Between Tests

```kotlin
class TaskServiceTest {
    private val mockRepo = mockk<TaskRepository>()
    
    @BeforeEach
    fun setup() {
        clearMocks(mockRepo) // Reset all stubbing and verification
    }
    
    @Test
    fun `test 1`() { /* ... */ }
    
    @Test
    fun `test 2`() { /* ... */ }
}
```

### 4. Avoid Over-Specification

```kotlin
// ❌ BAD: Too specific, brittle
verify { 
    mockRepo.save(Task(
        id = 1, 
        name = "Exact name", 
        priority = Priority.HIGH,
        createdAt = LocalDateTime.of(2024, 1, 1, 10, 0)
    ))
}

// ✅ GOOD: Verify what matters
verify { 
    mockRepo.save(match { 
        it.name == "Exact name" && it.priority == Priority.HIGH 
    })
}
```

---

## MockK vs Real Implementation: Decision Guide

| Scenario | Use MockK | Use Real/Fake |
|----------|-----------|---------------|
| External API call | ✅ | ❌ |
| Database query | ✅ | Use test DB or fake |
| Email service | ✅ | ❌ |
| File system | ✅ | Use temp directory or fake |
| Your repository | ❌ | ✅ Use fake |
| Your service layer | ❌ | ✅ Use real |
| Business logic | ❌ | ✅ Use real |
| Value objects | ❌ | ✅ Use real |

---

## Common Pitfalls

### 1. Mocking Everything

```kotlin
// ❌ BAD: Mock overload
@Test
fun `over mocked test`() {
    val mockA = mockk<A>()
    val mockB = mockk<B>()
    val mockC = mockk<C>()
    
    every { mockA.getData() } returns "data"
    every { mockB.process(any()) } returns Result.Success
    every { mockC.save(any()) } returns Unit
    
    // Test tells you nothing about actual behavior
}
```

### 2. Not Verifying Mocks

```kotlin
// ❌ BAD: Mock without verification
@Test
fun `pointless mock`() {
    val mockNotifier = mockk<Notifier>(relaxed = true)
    
    service.doSomething(mockNotifier)
    
    // No verification = mock is pointless
    // Either verify it or use a fake
}
```

### 3. Verifying Implementation Details

```kotlin
// ❌ BAD: Testing how, not what
@Test
fun `fragile test`() {
    verify { mockRepo.findById(1) }
    verify { mockRepo.update(any()) }
    
    // Breaks if you refactor to findAndUpdate()
}

// ✅ GOOD: Test behavior
@Test
fun `resilient test`() {
    val result = service.updateTask(1, "New name")
    
    assertEquals("New name", result.name)
}
```

---

## Testing with Coroutines

MockK supports Kotlin coroutines with `coEvery` and `coVerify`.

```kotlin
interface AsyncTaskRepository {
    suspend fun fetchTasks(): List<Task>
    suspend fun saveTask(task: Task)
}

@Test
fun `mock suspend function`() = runTest {
    val mockRepo = mockk<AsyncTaskRepository>()
    
    // Stub suspend function
    coEvery { mockRepo.fetchTasks() } returns listOf(
        Task(id = 1, name = "Task 1")
    )
    
    val service = TaskService(mockRepo)
    val tasks = service.getTasks()
    
    assertEquals(1, tasks.size)
    
    // Verify suspend function
    coVerify { mockRepo.fetchTasks() }
}
```

---

## Complete Example: Payment Service

```kotlin
interface PaymentGateway {
    fun charge(amount: Double, cardToken: String): PaymentResult
}

interface TransactionRepository {
    fun save(transaction: Transaction)
}

class PaymentService(
    private val gateway: PaymentGateway,
    private val repository: TransactionRepository
) {
    fun processPayment(amount: Double, cardToken: String): PaymentStatus {
        return when (val result = gateway.charge(amount, cardToken)) {
            is PaymentResult.Success -> {
                repository.save(Transaction(
                    id = result.transactionId,
                    amount = amount,
                    status = "completed"
                ))
                PaymentStatus.Success(result.transactionId)
            }
            is PaymentResult.Failure -> {
                PaymentStatus.Failed(result.reason)
            }
        }
    }
}

class PaymentServiceTest {
    
    @Test
    fun `successful payment saves transaction`() {
        // Arrange
        val mockGateway = mockk<PaymentGateway>()
        val mockRepo = mockk<TransactionRepository>(relaxed = true)
        
        every { 
            mockGateway.charge(99.99, "tok_123") 
        } returns PaymentResult.Success(transactionId = "txn_456")
        
        val service = PaymentService(mockGateway, mockRepo)
        
        // Act
        val status = service.processPayment(99.99, "tok_123")
        
        // Assert
        assertTrue(status is PaymentStatus.Success)
        assertEquals("txn_456", (status as PaymentStatus.Success).transactionId)
        
        verify(exactly = 1) { mockGateway.charge(99.99, "tok_123") }
        verify { 
            mockRepo.save(match { 
                it.id == "txn_456" && it.amount == 99.99 
            })
        }
    }
    
    @Test
    fun `failed payment does not save transaction`() {
        val mockGateway = mockk<PaymentGateway>()
        val mockRepo = mockk<TransactionRepository>(relaxed = true)
        
        every { 
            mockGateway.charge(any(), any()) 
        } returns PaymentResult.Failure("Insufficient funds")
        
        val service = PaymentService(mockGateway, mockRepo)
        val status = service.processPayment(99.99, "tok_123")
        
        assertTrue(status is PaymentStatus.Failed)
        
        // Verify repository was never called
        verify(exactly = 0) { mockRepo.save(any()) }
    }
}
```

---

## References

- [MockK Official Documentation](https://mockk.io/)
- [MockK GitHub Repository](https://github.com/mockk/mockk)
- [Mocking is not Rocket Science (Kotlin Academy)](https://blog.kotlin-academy.com/mocking-is-not-rocket-science-basics-ae55d0aadf2b)

---

## Next Steps

- Review [Testing Fundamentals](testing.md) for test strategy
- Learn [Dependency Injection](dependency-injection.md) with Koin
- See [Complete Test Examples](examples/) for real-world test suites
