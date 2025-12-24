# Testing Overview

Testing is a critical part of the software development lifecycle. It ensures that your code works as expected and prevents regressions when you make changes.

## The Testing Pyramid

The Testing Pyramid is a framework that guides the distribution of different types of tests in your application.

1.  **Unit Tests** (Base): These tests focus on individual components (classes or methods) in isolation. They are fast, cheap to write, and should make up the majority of your test suite.
    *   **Tools**: JUnit, Mockito.
2.  **Integration Tests** (Middle): These tests verify that different parts of the system work together correctly (e.g., a Service talking to a Database). They are slower than unit tests but provide more confidence.
    *   **Tools**: Spring Boot Test, Testcontainers.
3.  **End-to-End (E2E) Tests** (Top): These tests simulate a real user scenario from start to finish (e.g., clicking a button in the browser and checking the result). They are the slowest and most expensive to maintain but verify the entire system.
    *   **Tools**: Playwright, Selenium, Cypress.

## Best Practices (FIRST)

Good tests should follow the **FIRST** principles:

-   **Fast**: Tests should run quickly so developers can run them frequently.
-   **Independent**: Tests should not depend on each other. One test failure should not cause others to fail.
-   **Repeatable**: Tests should produce the same result every time they run, in any environment.
-   **Self-validating**: Tests should automatically detect if they passed or failed (no manual inspection required).
-   **Timely**: Tests should be written at the same time as the code (or before, in TDD).

## Code Coverage
While high code coverage is good, it is not the only metric that matters. Focus on testing **critical paths** and complex business logic rather than just trying to hit 100% coverage on getters and setters.
