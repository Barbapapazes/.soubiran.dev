---
id: df7df4a2-2fad-43ae-88dd-d475c4c2ff7b
title: Hibernate
description: Hibernate is a popular Object-Relational Mapping (ORM) framework for Java applications that implements the Jakarta Persistence API (JPA).
---

[Hibernate](https://hibernate.org) is a popular [Object-Relational Mapping (ORM)](/database/object-relational-mapping) framework for Java applications.

It's main part is the entity manager that implements the Jakarta Persistence API (JPA)

```java
User user = entityManager.find(User.class, 1L);
```

```java
interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByLastName(String lastName);
}
```

## Persistence Context

This is the most important concept in Hibernate. The persistence context is a first-level cache that seats between your application and the database. While you're in a persistence context, Hibernate tracks all the changes made to your entities, and automatically synchronizes them with the database at the end.

A persistence context is named a `Session` in Hibernate. Each repository method is executed within a session.

```java
userRepository.findById(1L); // within a session
// Outside of session
userRepository.save(user); // within a another session
```

From this point of view, tracking changes does not make sense as you're instantly detaching the entity after the repository method returns.

Everything becomes more interesting when you're within a transaction as it keeps the session open for the whole transaction duration.

```java
@Transactional
public void updateUser(Long id, String newEmail) {
    User user = userRepository.findById(id).orElseThrow();
    user.setEmail(newEmail); // change is tracked
}
```

At the end of the transaction, Hibernate automatically flushes all the changes to the database.

## Entity Lifecycle

So, an entity can be in one of the following four states, depending on its association with the persistence context:

- **Transient**: created with `new`, not in the session and not in the database.
    ```java
    User user = new User();
    ```
- **Persistent (managed)**: attached to a session; changes are tracked and flushed on commit.
    ```java
    @Transactional
    public void createUser() {
        // within a session
    }
    ```
- **Detached**: was managed but no longer attached (session closed/evicted); changes aren’t tracked.
    ```java
    User user = entityManager.find(User.class, 1L);
    entityManager.detach(user);
    ```
- **Removed**: marked for deletion and removed on flush/commit.
    ```java
    User user = entityManager.find(User.class, 1L);
    entityManager.remove(user);
    ```

## DDL & Validation

The `spring.jpa.hibernate.ddl-auto` property controls how Hibernate handles the database schema at startup. The only recommended value is `validate`, which ensures that the database schema matches the entity definitions without making any changes. Combined with [Flyway](/java/data/flyway.md), this ensure that your schema is always up-to-date and consistent with your code.

<!--

Move somewhere else? or maybe just the n+1 explanation?

## The N+1 Select Problem

The N+1 problem is a common performance issue in ORMs. It happens when you fetch a list of entities (1 query) and then access a lazy-loaded relationship for each of them, triggering a separate query for each entity (N queries).

**Example**: Fetching 100 users and then accessing `user.getAddress()` for each one results in 101 queries.

### Solutions
-   **`JOIN FETCH`**: Use JPQL to fetch the related entities in the initial query.
    ```sql
    SELECT u FROM User u JOIN FETCH u.address
    ```
-   **EntityGraph**: Define a graph in your repository to specify which paths (relationships) should be fetched eagerly for a specific method.

## Projections

Sometimes you don't need the full entity. Projections allow you to fetch only the specific fields you need. This improves performance by reducing the amount of data transferred from the database.

-   **Interface-based**: Define an interface with getter methods matching the property names. Spring Data generates the implementation on the fly.
-   **Class-based (DTOs)**: Use Java Records or POJOs. The query result is mapped directly to the constructor. -->
