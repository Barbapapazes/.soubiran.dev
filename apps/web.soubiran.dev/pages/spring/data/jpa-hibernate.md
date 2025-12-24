# Hibernate

**JPA (Jakarta Persistence API)** is a specification that defines how to persist data in Java applications. **Hibernate** is the most popular implementation of this specification. It acts as an Object-Relational Mapper (ORM), bridging the gap between object-oriented Java code and relational databases.

## Entity Lifecycle

Understanding the lifecycle of an entity is crucial for effective data management:

1.  **Transient**: A newly created object (using `new`) that is not yet associated with a Hibernate Session (Persistence Context) and has no representation in the database.
2.  **Persistent (Managed)**: An object that is associated with a Session. Any changes made to the object will be automatically tracked and synchronized with the database upon transaction commit or flush.
3.  **Detached**: An object that was previously persistent but is no longer associated with a Session (e.g., after the session is closed). Changes to detached objects are not tracked.
4.  **Removed**: An object that is scheduled to be deleted from the database.

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
-   **Class-based (DTOs)**: Use Java Records or POJOs. The query result is mapped directly to the constructor.

## DDL & Validation

The `spring.jpa.hibernate.ddl-auto` property controls how Hibernate handles the database schema at startup:

-   **`validate`**: Checks if the database schema matches the entity definitions. If not, the application fails to start. **This is the recommended setting for production.**
-   **`update`**: Attempts to update the schema to match the entities. This can be risky in production as it might not handle complex changes correctly.
-   **`create-drop`**: Creates the schema at startup and drops it at shutdown. Useful for testing.
