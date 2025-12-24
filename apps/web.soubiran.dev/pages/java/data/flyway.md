# Flyway

[Flyway](https://flywaydb.org/) is a popular open-source [database migration](/spring/data/migrations) tool that helps manage and automate database schema changes. It is widely used in Java applications, especially with frameworks like Spring Boot.

Spring Boot integrates seamlessly with Flyway which makes it easy to set up and use. Migration scripts are typically written in SQL, located in the `src/main/resources/db/migration` directory by default. Files are named using a specific convention (e.g., `V1__create_users_table.sql`), where `V1` indicates the version of the migration.

```sql [V1__create_users_table.sql]
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

When the application starts, Flyway checks the database for a special table called `flyway_schema_history` that tracks which migrations have already been applied. It then executes any new migration scripts in order, ensuring that the database schema is always up-to-date.

| installed_rank | version | description          | type   | script                      | checksum | installed_by | installed_on         | execution_time | success |
|----------------|---------|----------------------|--------|-----------------------------|----------|--------------|----------------------|----------------|---------|
| 1              | 1       | create users table   | SQL    | V1__create_users_table.sql  | 123456   | esteban      | | 2024-01-01 12:00:00 | 15             | true    |
| 2              | 2       | add last_login column | SQL    | V2__add_last_login_to_users.sql | 789012   | esteban      | 2024-01-02 12:00:00 | 5              | true    |

If an existing migration script is modified after being applied, Flyway will detect the change via a checksum mismatch and fail to start, preventing potential inconsistencies.

> [!NOTE]
> An applied migration script should **never** be modified. If changes are needed, create a new migration script instead. Go forward-only!

In combination with [Hibernate](/spring/data/hibernate), you can ensure that your database schema is in the expected state from the code.
