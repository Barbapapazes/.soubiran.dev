# Transactions

A transaction is a unit of work that is performed against a database. Transactions ensure that the database remains in a consistent state even in the event of system failure.

## ACID Properties

For a transaction to be reliable, it must adhere to the ACID properties:

-   **Atomicity**: "All or nothing". The entire transaction takes place at once or doesn't happen at all. If one part fails, the entire transaction fails and the database state is left unchanged.
-   **Consistency**: The database must remain in a valid state before and after the transaction. All data written must be valid according to all defined rules, constraints, and triggers.
-   **Isolation**: Multiple transactions occurring at the same time must not affect each other's execution. The intermediate state of a transaction is invisible to other transactions.
-   **Durability**: Once a transaction is committed, the changes are permanent and will survive a system failure.

## Isolation Levels

The isolation level defines how strictly the database separates transactions. Lower isolation levels allow for higher concurrency but introduce potential data anomalies.

-   **Read Uncommitted**: The lowest level. One transaction may read not-yet-committed changes made by another transaction (Dirty Read).
-   **Read Committed**: A transaction can only read data that has been committed. This prevents Dirty Reads but allows Non-Repeatable Reads (reading the same row twice yields different results). This is the default in PostgreSQL.
-   **Repeatable Read**: Ensures that if a transaction reads a row, it will see the same data if it reads it again. This prevents Non-Repeatable Reads but can still allow Phantom Reads (new rows appearing).
-   **Serializable**: The highest level. It emulates serial transaction execution, as if transactions had been executed one after another. It prevents all anomalies but has the lowest performance.

## Management

-   **Begin**: Starts a new transaction.
-   **Commit**: Saves the changes made during the transaction.
-   **Rollback**: Reverts the changes made during the transaction.

In Spring, the `@Transactional` annotation handles this declaratively. It opens a transaction before the method starts and commits it after the method finishes (or rolls back if a runtime exception occurs).
