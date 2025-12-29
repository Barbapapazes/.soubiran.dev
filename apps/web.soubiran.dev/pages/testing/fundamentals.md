# Testing Fundamentals

## Recap

| Concept | Definition | Applies To |
|---------|------------|------------|
| **AAA Pattern** | Arrange-Act-Assert: test structure for clarity | All testing frameworks |
| **Given-When-Then** | BDD pattern describing scenarios | Behavior-driven testing |
| **Test Double** | Generic term for fake objects | All OOP languages |
| **Mock** | Pre-programmed object verifying interactions | Unit testing with dependencies |
| **Fake** | Lightweight working implementation | Integration testing |
| **Stub** | Returns predetermined responses | Providing test data |
| **Spy** | Records calls while keeping real behavior | Hybrid testing scenarios |

---

## Test Structure Patterns

### AAA Pattern (Arrange-Act-Assert)

A structural pattern for organizing test code. Focuses on **what** you're testing.

**Structure**:
1. **Arrange**: Set up test data and preconditions
2. **Act**: Execute the behavior being tested
3. **Assert**: Verify the outcome

**Use When**:
- Writing unit tests
- Testing technical implementation details
- You need clear separation of test phases

**Example (pseudo-code)**:
```
test_addItem_increasesCartSize() {
    // Arrange
    cart = ShoppingCart()
    item = Item("Product", 10.0)
    
    // Act
    cart.add(item)
    
    // Assert
    assert cart.size() == 1
}
```

**Benefits**:
- Clear test structure
- Easy to understand test intent
- Separates setup from verification

---

### Given-When-Then Pattern

A behavior-driven pattern describing scenarios. Focuses on **why** you're testing.

**Structure**:
1. **Given**: Initial context and preconditions (business state)
2. **When**: Event or action occurs (business event)
3. **Then**: Expected outcome (business result)

**Use When**:
- Writing acceptance tests
- Documenting business rules
- Collaborating with non-technical stakeholders
- Testing user-facing behavior

**Example (pseudo-code)**:
```
test_checkout_with_coupon() {
    // Given a cart with items totaling $100 and a 20% coupon
    cart = ShoppingCart()
    cart.add(Item("Product", 100.0))
    coupon = Coupon("SAVE20", 0.20)
    
    // When the user applies the coupon and checks out
    cart.applyCoupon(coupon)
    total = cart.checkout()
    
    // Then the total should be $80
    assert total == 80.0
}
```

**Benefits**:
- Natural language structure
- Aligns with business requirements
- Readable by non-developers
- Documents behavior clearly

---

### AAA vs Given-When-Then: Which to Choose?

| Aspect | AAA | Given-When-Then |
|--------|-----|-----------------|
| **Focus** | Technical implementation | Business behavior |
| **Audience** | Developers | Stakeholders + Developers |
| **Language** | Technical terms | Business language |
| **Scope** | Unit tests | Integration/E2E tests |
| **Readability** | Technical precision | Natural language |
| **Documentation** | Implementation details | Business rules |

**Practical Rule**: 
- Use **AAA** for unit tests focused on code logic
- Use **Given-When-Then** for integration/E2E tests focused on user behavior

**Note**: Both patterns can coexist. The structure is similar; only the language and mindset differ.

---

## Test Doubles: Complete Taxonomy

Test doubles are objects that replace real dependencies during testing. This is a **universal concept** applicable to any OOP language.

```
Test Double (Generic Term)
├── Dummy (never used)
├── Stub (returns canned data)
├── Fake (simplified working implementation)
├── Spy (records + real behavior)
└── Mock (pre-programmed expectations)
```

### Dummy

**Definition**: Passed as a parameter but never actually used.

**Purpose**: Fill required parameters that the test doesn't care about.

**Example Use Case**:
```
test_login_requires_credentials() {
    logger = DummyLogger()  // Never called in this test
    authService = AuthService(logger)
    
    result = authService.login("user", "pass")
    
    assert result.success == true
}
```

---

### Stub

**Definition**: Provides predetermined responses to calls. No behavior verification.

**Purpose**: Supply specific return values without caring how the dependency is used.

**Example Use Case**:
```
test_greeting_depends_on_time() {
    clock = StubClock()
    clock.currentHour = 14  // Always 2 PM
    
    greeter = Greeter(clock)
    
    assert greeter.greet() == "Good afternoon!"
}
```

**Characteristics**:
- Returns fixed values
- No verification of how it was called
- Simple to implement

---

### Fake

**Definition**: A working implementation with shortcuts (e.g., in-memory database instead of PostgreSQL).

**Purpose**: Provide realistic behavior without external dependencies.

**Example Use Case**:
```
class FakeUserRepository implements UserRepository {
    users = []
    
    save(user) {
        users.append(user)
    }
    
    findById(id) {
        return users.find(u => u.id == id)
    }
}

test_service_creates_user() {
    repo = FakeUserRepository()
    service = UserService(repo)
    
    service.createUser("Alice", "alice@example.com")
    
    assert repo.users.length == 1
    assert repo.users[0].name == "Alice"
}
```

**Characteristics**:
- Has working logic
- Simplified implementation (no DB, no network)
- Assert **what it produces** (state), not how it was called

**When to Use**:
- Integration tests
- Testing state changes
- Tests that should survive refactoring

---

### Spy

**Definition**: Records interactions while delegating to real implementation.

**Purpose**: Verify calls but keep real behavior.

**Example Use Case**:
```
class SpyEmailService extends RealEmailService {
    sentEmails = []
    
    send(email) {
        sentEmails.append(email)
        super.send(email)  // Delegate to real implementation
    }
}

test_password_reset_sends_email() {
    emailService = SpyEmailService()
    authService = AuthService(emailService)
    
    authService.resetPassword("user@example.com")
    
    assert emailService.sentEmails.length == 1
    assert "Reset Password" in emailService.sentEmails[0].subject
}
```

**Characteristics**:
- Wraps real implementation
- Records interactions
- Maintains real behavior

---

### Mock

**Definition**: Pre-programmed object with expectations about how it will be called.

**Purpose**: Verify interactions with dependencies (behavior verification).

**Example Use Case**:
```
test_checkout_charges_payment() {
    paymentGateway = Mock(PaymentGateway)
    paymentGateway.expect_call("charge", amount=99.99)
    paymentGateway.will_return(PaymentResult.Success)
    
    orderService = OrderService(paymentGateway)
    orderService.placeOrder(Order(total=99.99))
    
    paymentGateway.verify_expectations()  // Fails if charge() not called
}
```

**Characteristics**:
- Pre-programmed expectations
- Verifies **how it was used** (calls, arguments, order)
- Fails if expectations not met

**When to Use**:
- Verifying interactions with external boundaries
- Testing side effects (emails, API calls, logging)
- Simulating errors or edge cases
- Strict unit test isolation

---

## Mock vs Fake: The Critical Decision

This is the most common confusion in testing. Here's how to decide:

| Question | Use |
|----------|-----|
| "Did X call Y with correct arguments?" | **Mock** |
| "Does the system produce correct results?" | **Fake** |
| "Will this test survive refactoring?" | **Fake** |
| "Do I need to verify call order/count?" | **Mock** |
| "Am I testing external boundaries?" | **Mock** |
| "Am I testing my own domain logic?" | **Fake** |

### Practical Guidelines

#### Mock These (External Boundaries)
- HTTP clients
- Database connections
- File system operations
- Third-party APIs
- Email/SMS services
- Payment gateways
- External message queues

#### Fake These (Your Domain)
- Repositories
- Services
- Business logic
- In-memory caches
- Domain models

### Example: Payment Processing

```
// ❌ BAD: Mocking everything
test_process_order() {
    mockCart = Mock(ShoppingCart)
    mockCart.expect_call("getTotal").returns(100.0)
    
    mockPricer = Mock(PriceCalculator)
    mockPricer.expect_call("calculate").returns(100.0)
    
    mockPayment = Mock(PaymentGateway)
    mockPayment.expect_call("charge", 100.0).returns(Success)
    
    service = OrderService(mockCart, mockPricer, mockPayment)
    service.process()
    
    // All mocks verify their expectations
}
// Problem: Test is fragile, tells you nothing about actual behavior

// ✅ GOOD: Fake domain, mock boundaries
test_process_order() {
    fakeCart = FakeShoppingCart()
    fakeCart.add(Item("Product", 100.0))
    
    mockPayment = Mock(PaymentGateway)
    mockPayment.expect_call("charge", 100.0).returns(Success)
    
    service = OrderService(fakeCart, RealPriceCalculator(), mockPayment)
    result = service.process()
    
    assert result.success == true
    assert result.total == 100.0
    mockPayment.verify()
}
// Better: Tests actual behavior, mocks only external boundary
```

---

## Layered Testing Strategy

### Unit Tests → Mocks at Boundaries

Test individual components in isolation. Mock only external dependencies.

**Goal**: Verify single unit of code logic
**Speed**: Fast (milliseconds)
**Coverage**: 70% of tests should be here

---

### Integration Tests → Fakes

Test multiple components working together. Use fakes for all dependencies.

**Goal**: Verify components interact correctly
**Speed**: Medium (seconds)
**Coverage**: 20% of tests should be here

---

### E2E Tests → Real Implementations

Test complete system with real dependencies (or test equivalents).

**Goal**: Verify user workflows end-to-end
**Speed**: Slow (seconds to minutes)
**Coverage**: 10% of tests should be here

---

## Test Independence

Tests must be **independent** and **isolated**.

### Independent

Each test should be able to run alone or in any order.

```
// ❌ BAD: Tests depend on each other
test_1_creates_user() {
    service.createUser("Alice")
}

test_2_finds_user() {
    user = service.findUser("Alice")  // Depends on test_1
    assert user != null
}

// ✅ GOOD: Each test is self-contained
test_creates_user() {
    service = UserService()
    service.createUser("Alice")
    assert service.count() == 1
}

test_finds_user() {
    service = UserService()
    service.createUser("Alice")
    user = service.findUser("Alice")
    assert user != null
}
```

### Isolated

Tests should not affect each other through shared state.

```
// ❌ BAD: Shared mutable state
static sharedService = UserService()

test_1() {
    sharedService.add("Alice")
}

test_2() {
    sharedService.add("Bob")
    assert sharedService.count() == 1  // Fails if test_1 ran first
}

// ✅ GOOD: Fresh instance per test
setup() {
    service = UserService()  // New instance each time
}

test_1() {
    service.add("Alice")
    assert service.count() == 1
}

test_2() {
    service.add("Bob")
    assert service.count() == 1
}
```

---

## Test Naming Conventions

Good test names document behavior.

### Pattern: `test_<action>_<condition>_<outcome>`

```
test_login_withValidCredentials_returnsSuccess()
test_login_withInvalidPassword_returnsError()
test_checkout_withEmptyCart_throwsException()
test_addItem_whenCartFull_ignoresItem()
```

### Alternative (Given-When-Then):

```
test_givenValidCredentials_whenLogin_thenSuccess()
test_givenInvalidPassword_whenLogin_thenError()
```

### Keep It Readable

```
// ❌ BAD
test_1()
test_loginMethod()
test_tc_045()

// ✅ GOOD
test_login_succeeds_with_valid_credentials()
test_empty_cart_cannot_checkout()
test_expired_coupon_is_rejected()
```

---

## Common Testing Antipatterns

### 1. Testing Implementation Details

```
// ❌ BAD: Tests how, not what
test_service_calls_repository() {
    mock = Mock(Repository)
    service = Service(mock)
    
    service.process()
    
    verify mock.findAll() was called
    verify mock.save() was called
}

// ✅ GOOD: Tests behavior
test_service_processes_items() {
    repo = FakeRepository()
    repo.add(Item("Test"))
    service = Service(repo)
    
    result = service.process()
    
    assert result.processedCount == 1
}
```

### 2. Overuse of Mocks

```
// ❌ BAD: Mock everything
test_with_too_many_mocks() {
    mock1 = Mock(A)
    mock2 = Mock(B)
    mock3 = Mock(C)
    mock4 = Mock(D)
    
    // 50 lines of mock setup
    
    // Test tells you nothing
}

// ✅ GOOD: Mock only boundaries
test_with_appropriate_mocks() {
    fakeRepo = FakeRepository()
    realService = RealBusinessLogic()
    mockExternalApi = Mock(ExternalAPI)
    
    // Test actual behavior
}
```

### 3. Flaky Tests

Tests that pass/fail randomly.

**Causes**:
- Timing dependencies
- Random data without seeds
- Shared state between tests
- External service dependencies

**Solutions**:
- Use deterministic test data
- Mock time/randomness
- Ensure test isolation
- Use fakes for external services

---

## References

- [Martin Fowler - Test Doubles](https://martinfowler.com/bliki/TestDouble.html)
- [Martin Fowler - Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html)
- [Test Pyramid - Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- [xUnit Test Patterns](http://xunitpatterns.com/)

---

## Language-Specific Implementations

- **Kotlin**: [Testing in Kotlin](../kotlin/testing.md) with JUnit 5 and MockK
- **Java**: [Testing in Java](../java/testing/) with JUnit and Mockito
- **Spring**: [Testing Spring Applications](../spring/testing/)
