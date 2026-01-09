---
id: f0833971-9f8c-4f3e-bb1c-bafefadf3ce9
title: Object-Relational Mapping
description: Object-Relational Mapping (ORM) is a programming technique that allows developers to interact with relational databases using object-oriented programming languages.
---

Object-Relational Mapping (ORM) is an essential programming technique used by nearly all modern applications to interact with relational databases.

## The Two Worlds

When building an application, two worlds need to communicate:

1. The object-oriented world of the application code:

  ```java
  public class User {
      private Long id;
      private String username;
      private String email;
  }
  ```

2. The relational world of the database:

  ```sql
  create table users (
      id bigint generated always as identity primary key,
      username varchar(50) not null,
      email varchar(100) not null
  );
  ```

Nearly all applications need to bridge these two worlds because the application reads and writes data to a relational database.

## Bridging the Gap

These two worlds follow different paradigms. The application code uses objects, while the database uses tables and rows.

For example, when querying a user from the database, the result is a set of rows, each with columns.

Imagine executing this SQL query from the application code:

```java
ResultSet rs = statement.executeQuery("SELECT id, username, email FROM users WHERE id = 1");
```

You can imagine the data contained in the `rs` variable like this:

| id | username | email               |
|----|----------|---------------------|
| 1  | johndoe  | johndoe@example.com |
| 2  | janedoe  | janedoe@example.com |

This is cumbersome to work with in an object-oriented language.

To bridge this gap, we can map the rows from the database to objects in the application code.

```java
User user = new User();

if (rs.next()) {
    user.setId(rs.getLong("id"));
    user.setUsername(rs.getString("username"));
    user.setEmail(rs.getString("email"));
}
```

However, this manual mapping is tedious, repetitive, and error-prone regardless of the application's scale.

## The Role of ORM

This is exactly where object-relational mapping (ORM) frameworks come into play. Instead of manually mapping rows to objects, ORM frameworks automate this process.

In the previous example, using an ORM framework you could write:

```java
User user = entityManager.find(User.class, 1L);
```

The ORM framework automatically handles SQL execution, result-set processing, and object mapping.

Each language has its own ORM frameworks. Here are some popular ones:

- Hibernate (Java)
- Entity Framework (C#/.NET)
- Lucid (AdonisJS/Node.js)
- Eloquent (Laravel/PHP)
- ActiveRecord (Ruby on Rails)
