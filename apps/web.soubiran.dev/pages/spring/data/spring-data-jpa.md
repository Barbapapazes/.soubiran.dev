# Spring Data JPA

Spring Data JPA aims to significantly reduce the amount of boilerplate code required to implement data access layers for various persistence stores.

> [!NOTE]
> This must not be confused with [JPA](/java/java-persistence-api) itself or [Hibernate](/java/hibernate). JPA defines what persistence is, Hibernate implements how it works, and Spring Data JPA simplifies how you use it.

## Repositories

The central concept is the **Repository**. It is an interface that defines data access operations.
-   **`CrudRepository`**: Provides basic CRUD functions (save, findById, delete, etc.).
-   **`JpaRepository`**: Extends `CrudRepository` and adds JPA-specific methods like flushing the persistence context and batch deleting.

```java [UserRepository.java]
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}
```

That's it. You only have to define an interface. At runtime, Spring Data JPA will inject a proxy implementation of this interface and parse the method names to generate the appropriate queries using JPQL or Criteria API.

## Query Methods

Spring Data JPA allows you to define queries simply by declaring method names.

### Derived Queries

The framework parses the method name and generates the SQL query for you.
-   `findByEmail(String email)` translates to `SELECT ... WHERE email = ?`
-   `findByNameAndActiveTrue(String name)` translates to `SELECT ... WHERE name = ? AND active = true`

This is a powerful feature that can quickly become complex.

### Custom Queries (`@Query`)

For more complex queries, you can use the `@Query` annotation to write JPQL or native SQL directly.

```java
@Query("SELECT u FROM User u WHERE u.active = true AND u.createdAt > :date")
List<User> findActiveUsersSince(@Param("date") LocalDate date);
```

## Pagination

Pagination is built-in. You can pass a `Pageable` object to any repository method to request a specific page of results.
The method can return:

-   **`Page<T>`**: Contains the list of results plus metadata (total pages, total elements). This requires an extra count query.
-   **`Slice<T>`**: Contains the list of results and a flag indicating if there is a next slice. This avoids the expensive count query.

```java
Page<User> findByLastname(String lastname, Pageable pageable);
```

> [!TIP]
> Counting rows can be expensive on large datasets. Use it wisely and challenge the business requirements when possible. You can also consider using database statistics to have an approximate count.
