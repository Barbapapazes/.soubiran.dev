# Java Persistence API

**Java Persistence API (JPA)** is a specification that defines how to persist data in Java applications. It provides a standard way to map Java objects to relational database tables and vice versa.

Then, it's implemented by various frameworks, with [**Hibernate**](/java/data/hibernate) being the most popular one.

## Key Concepts

The specification introduces several key concepts:

- **Entity**: A lightweight, persistent domain object that represents a table in a relational database. Each instance corresponds to a row in that table.
- **Entity Manager**: The primary interface used to interact with the persistence context. It manages the lifecycle of entities, including operations like create, read, update, and delete (CRUD).
- **Persistence Context**: A set of entity instances in which for any persistent entity identity, there is a unique entity instance. It acts as a first-level cache.
- **JPQL (Java Persistence Query Language)**: A query language similar to SQL but operates on the entity objects rather than database tables. It allows for database-agnostic queries.

## Annotations

JPA uses annotations to define the mapping between Java classes and database tables:

- `@Entity`: Marks a class as a JPA entity.
- `@Table`: Specifies the table name in the database.
- `@Id`: Denotes the primary key of the entity.
- `@GeneratedValue`: Specifies how the primary key value is generated.
- `@Column`: Maps a class field to a database column.
- `@OneToMany`, `@ManyToOne`, `@ManyToMany`, `@OneToOne`: Define relationships between entities.

The end-up by creating POJO classes with these annotations to represent database tables.

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
```

## Implementing the JPA

It's important to understand that JPA provides only the specification with the interfaces and annotations. Then, an implementation like Hibernate is needed to provide the actual functionality.

For example, the `EntityManager` interface is defined by JPA, but Hibernate provides the concrete class that implements it. Annotations like `@Entity` are part of the JPA specification, but Hibernate interprets them to perform the actual mapping and persistence operations. It happens at [runtime](/runtime-vs-compile-time) with reflection or bytecode enhancement.
