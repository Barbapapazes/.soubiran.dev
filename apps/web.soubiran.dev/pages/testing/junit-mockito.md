# JUnit & Mockito

**JUnit** is the standard testing framework for Java, and **Mockito** is the most popular mocking framework. Together, they form the foundation of unit testing in Java.

## JUnit 5 Annotations

-   **`@Test`**: Marks a method as a test case.
-   **`@BeforeEach`**: Executed before *each* test method. Useful for resetting the state.
-   **`@AfterEach`**: Executed after *each* test method. Useful for cleanup.
-   **`@BeforeAll`**: Executed once before *all* tests in the class. Must be static. Useful for expensive setup.
-   **`@AfterAll`**: Executed once after *all* tests in the class. Must be static.

### Assertions
Assertions are used to verify the result of a test.
-   `assertEquals(expected, actual)`: Checks if two values are equal.
-   `assertTrue(condition)` / `assertFalse(condition)`: Checks if a boolean condition is met.
-   `assertThrows(Exception.class, () -> { ... })`: Verifies that the code throws a specific exception.

## Mockito

When unit testing a class (e.g., `UserService`), you want to test it in isolation. However, `UserService` might depend on `UserRepository`. Instead of using a real database connection, you use a **Mock**.

### Key Concepts
-   **Mocking**: Creating a dummy object that mimics the behavior of a real object.
-   **Stubbing**: Defining how the mock should behave when specific methods are called.
-   **Verification**: Checking if specific methods were called on the mock.

### Annotations
-   **`@Mock`**: Creates a mock instance of the dependency.
-   **`@InjectMocks`**: Creates an instance of the class under test and injects the `@Mock`s into it.

### Example
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository; // The dependency to mock

    @InjectMocks
    private UserService userService; // The class to test

    @Test
    void shouldFindUser() {
        // Stubbing: When repository.findById(1) is called, return a specific user
        User mockUser = new User("John");
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        // Execution
        User result = userService.getUserById(1L);

        // Verification
        assertEquals("John", result.getName());
        verify(userRepository).findById(1L); // Ensure the repository was actually called
    }
}
```
