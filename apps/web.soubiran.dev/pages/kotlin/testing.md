# Testing in Kotlin

> [!NOTE]
> This guide focuses on **Kotlin-specific** testing with JUnit 5 and MockK. For universal testing concepts (AAA vs Given-When-Then, test doubles, mocking strategies), see [Testing Fundamentals](../testing/fundamentals.md).

## Recap

| Tool | Purpose | Use Case |
|------|---------|----------|
| **JUnit 5** | Testing framework | Unit and integration tests |
| **MockK** | Kotlin mocking library | Mocking dependencies |
| **@Test** | Test method annotation | Mark test functions |
| **@BeforeEach** | Setup annotation | Initialize before each test |
| **@Nested** | Group tests | Organize related tests |
| **@DisplayName** | Readable test names | Improve test reports |

---

## Kotlin Testing Setup

### Installation

```kotlin [build.gradle.kts]
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.1")
    testImplementation("io.mockk:mockk:1.13.8")
}

tasks.test {
    useJUnitPlatform()
}
```

---

## JUnit 5 Basics

### Simple Test

```kotlin
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class CalculatorTest {
    
    @Test
    fun `add should return sum of two numbers`() {
        // Arrange
        val calculator = Calculator()
        
        // Act
        val result = calculator.add(2, 3)
        
        // Assert
        assertEquals(5, result)
    }
}
```

---

## Test Lifecycle Annotations

```kotlin
class TaskServiceTest {
    
    @BeforeAll
    fun setupClass() {
        // Runs once before all tests in this class
        // Use for expensive setup (database connections)
    }
    
    @BeforeEach
    fun setup() {
        // Runs before each test method
        // Use for test isolation (fresh instances)
    }
    
    @Test
    fun `test case`() {
        // Individual test
    }
    
    @AfterEach
    fun teardown() {
        // Runs after each test method
        // Use for cleanup
    }
    
    @AfterAll
    fun teardownClass() {
        // Runs once after all tests
        // Use for resource cleanup
    }
}
```

### Grouping Tests with @Nested

```kotlin
@DisplayName("Task Service")
class TaskServiceTest {
    
    @Nested
    @DisplayName("Task Creation")
    inner class TaskCreation {
        
        @Test
        fun `creates task with valid name`() { }
        
        @Test
        fun `rejects task with empty name`() { }
    }
    
    @Nested
    @DisplayName("Task Completion")
    inner class TaskCompletion {
        
        @Test
        fun `marks task as complete`() { }
        
        @Test
        fun `prevents double completion`() { }
    }
}
```

---

## Common Testing Assertions

```kotlin
// Equality
assertEquals(expected, actual)
assertEquals(expected, actual, "Custom failure message")

// Boolean checks
assertTrue(condition)
assertFalse(condition)

// Null checks
assertNull(value)
assertNotNull(value)

// Collection checks
assertTrue(list.isEmpty())
assertEquals(3, list.size)
assertTrue(list.contains(item))

// Exception testing
assertThrows<IllegalArgumentException> {
    service.invalidOperation()
}

// Custom assertions
assertDoesNotThrow { service.safeOperation() }
assertAll(
    { assertEquals(expected1, actual1) },
    { assertEquals(expected2, actual2) }
)
```

---

## Testing Best Practices

### 1. One Assertion Per Concept

```kotlin
// ❌ BAD: Multiple unrelated assertions
@Test
fun `test multiple things`() {
    assertEquals(1, service.count())
    assertEquals("John", service.name())
    assertTrue(service.isActive())
}

// ✅ GOOD: Separate tests
@Test
fun `count returns correct value`() {
    assertEquals(1, service.count())
}

@Test
fun `name returns user name`() {
    assertEquals("John", service.name())
}
```

### 2. Test Names Describe Behavior

```kotlin
// ❌ BAD: Technical implementation detail
@Test
fun `testAddMethod()`

// ✅ GOOD: Behavior description
@Test
fun `adding task increases repository size by one`()
```

### 3. Avoid Test Interdependence

```kotlin
// ❌ BAD: Tests depend on execution order
@Test
fun `test 1`() {
    service.add(item) // Affects shared state
}

@Test
fun `test 2`() {
    assertEquals(1, service.count()) // Depends on test 1
}

// ✅ GOOD: Each test is isolated
@BeforeEach
fun setup() {
    service = TaskService() // Fresh instance each time
}
```

### 4. Test Edge Cases

```kotlin
@Test
fun `handles empty list`() { }

@Test
fun `handles null input`() { }

@Test
fun `handles maximum integer value`() { }

@Test
fun `handles concurrent modifications`() { }
```

---

## References

- [Martin Fowler - Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Test Pyramid - Martin Fowler](https://martinfowler.com/articles/practical-test-pyramid.html)

---

## Next Steps

- Learn [MockK](mockk.md) for advanced mocking in Kotlin
- Explore [Dependency Injection](dependency-injection.md) with Koin
- See [Testing Examples](examples/) for complete test suites
