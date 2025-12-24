---
id: 2b1da065-50d5-46fc-bc12-ff70b685d0a9
title: Database Migrations
description: Learn about database migrations, their purpose, and how they help manage schema changes over time, especially between different environments.
---

Database migrations are a way to manage changes to your database schema over time. They make it easier to evolve your database in a controlled, reproducible, and consistent manner.

Migrations are typically implemented as a series of incremental scripts that modify the database schema (e.g., creating tables, adding columns, changing data types).

For example, you might have a migration script that creates a `users` table:

```sql [V1__create_users_table.sql]
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Then, in a later migration, you might add a new column to that table:

```sql [V2__add_last_login_to_users.sql]
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
```

## How it Works

These migration scripts are managed by a migration tool (like [Flyway](/spring/data/flyway) or [Liquibase](https://www.liquibase.com/)) that keeps track of which migrations have been applied to the database. This is done by maintaining a special table (e.g., `schema_version` or `flyway_schema_history`) that records the version of each applied migration. This table also contains metadata such as the checksum of the migration script and the date it was applied.

> [!NOTE]
> If you touch a migration script that has already been applied, the migration tool will detect the change (via checksum mismatch) and fail to start, preventing potential inconsistencies.

Then, when you deploy a new version of your application, the migration tool checks the database and applies any new migrations in the correct order. This makes the database schema evolve alongside your application code, and manages changes safely, even in multi-developer teams or production environments.

If the migration process encounters an error (e.g., a syntax error in a SQL script), it will typically roll back the transaction to leave the database in a consistent state. In the case of flyway, it will stop the startup process and log the error for you to fix. This ensures the application starts only when the database schema is in the expected state.
