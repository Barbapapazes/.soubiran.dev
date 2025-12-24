# Learning Roadmap: From Competent to Master

Based on the current "Second Brain" content, here is the recommended path to deepen your expertise.

## 1. Advanced Java (The "Hard" Stuff)
Mastering how Java handles parallelism and modern functional patterns.

- [ ] **Concurrency** (`java/core/concurrency.md`)
    - Thread lifecycle, `synchronized`, `volatile`.
    - `ExecutorService` and Thread Pools.
    - `CompletableFuture` for asynchronous programming.
    - **Virtual Threads** (Project Loom).
- [ ] **Functional Programming** (`java/core/functional-programming.md`)
    - Lambdas and Method References.
    - `Stream` API (map, filter, reduce, collectors).
    - `Optional` best practices.
- [ ] **Memory Model** (`java/runtime/memory-model.md`)
    - Stack vs Heap details.
    - String Pool.
    - The "Happens-Before" relationship.

## 2. Production-Grade Spring
Moving from "it works" to "it's production-ready".

- [ ] **Observability** (`spring/boot/observability.md`)
    - Spring Boot Actuator.
    - Micrometer & Prometheus metrics.
    - Distributed Tracing (OpenTelemetry).
- [ ] **Advanced Security** (`spring/security/oauth2-jwt.md`)
    - Stateless authentication with JWT.
    - OAuth2 flows (Authorization Code).
    - OIDC (OpenID Connect).
- [ ] **AOP (Aspect-Oriented Programming)** (`spring/advanced/aop.md`)
    - How `@Transactional` works under the hood.
    - Creating custom annotations for cross-cutting concerns (logging, auditing).

## 3. Architecture & Design Patterns
Designing systems that are maintainable and scalable.

- [ ] **Clean Architecture** (`architecture/clean-architecture.md`)
    - Hexagonal Architecture (Ports & Adapters).
    - Domain-Driven Design (DDD) basics (Entities vs Value Objects, Aggregates).
- [ ] **Distributed Systems** (`architecture/distributed-systems.md`)
    - CAP Theorem.
    - Eventual Consistency.
    - Circuit Breakers (Resilience4j).

## 4. Modern Testing
Going beyond unit tests.

- [ ] **Testcontainers** (`testing/testcontainers.md`)
    - Spinning up real Docker containers (Postgres, Redis) for integration tests.
    - Avoiding H2 in-memory databases for better reliability.

## 5. Data & Performance
Optimizing data access and system speed.

- [ ] **Caching** (`database/caching-redis.md`)
    - Caching strategies (Write-through, Look-aside).
    - Redis data structures.
- [ ] **Query Optimization** (`database/query-optimization.md`)
    - Deep dive into `EXPLAIN ANALYZE`.
    - Index selectivity and composite indexes.
    - Database locking strategies.
