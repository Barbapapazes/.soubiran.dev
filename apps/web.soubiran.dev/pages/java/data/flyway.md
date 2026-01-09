---
id: c91cc1e5-07d6-4393-8751-ef4b03f2ea66
title: Flyway
description: Flyway is a popular open-source database migration tool that helps manage and automate database schema changes in Java applications.
---

[Flyway](https://flywaydb.org/) is a popular open-source [database migration](/spring/data/migrations) tool that helps manage and automate database schema changes.

> [!NOTE]
> Compared to other languages like PHP and JavaScript, Java developers tend to prefer writing raw SQL migration scripts rather than using an ORM-based migration tool.

## Usage

Migration scripts are typically written in SQL and located in the `src/main/resources/db/migration` directory. Files are named using a specific convention (e.g., `V1__create_users_table.sql`), where `V1` indicates the migration version, followed by a double underscore and a descriptive name (e.g., `create_users_table`).

```sql [V1__create_users_table.sql]
create table users (
    id bigint generated always as identity primary key,

    username varchar(50) not null,
    email varchar(100) not null,

    created_at timestamp default current_timestamp
);
```

## Under the Hood

Flyway automatically tracks the state of database migrations using a dedicated table within the database. The table is named `flyway_schema_history` and contains records of all applied migrations, including their version, description, execution time, and status.

| installed_rank | version | description            | type | script                      | checksum | installed_by | installed_on         | execution_time | success |
|----------------|---------|------------------------|------|-----------------------------|----------|--------------|----------------------|----------------|---------|
| 1              | 1       | create users table     | SQL  | V1__create_users_table.sql  | 123456   | esteban      | 2024-01-01 12:00:00  | 15             | true    |
| 2              | 2       | add last_login column  | SQL  | V2__add_last_login_to_users.sql | 789012   | esteban      | 2024-01-02 12:00:00  | 5              | true    |

When the application starts, Flyway checks this table to determine which migrations have already been applied and which are pending, and applies pending migrations in order. If any previously applied migration script has been modified since it was applied, as detected by the checksum, Flyway will raise an error to prevent inconsistencies.

> [!NOTE]
> Never change migration scripts that have already been applied to a production database. During development, you can modify recently created migration scripts, drop your database, and let Flyway reapply them from scratch.

This behavior ensures the desired state and the actual database state remain in sync, helping to avoid potential inconsistencies.

On the other hand, [Hibernate](/spring/data/hibernate) can automatically validate the database schema against the entity mappings. The combination of Flyway and Hibernate helps ensure your database schema matches the code's entity mappings.
