# SQL Basics

Structured Query Language (SQL) is the standard language for managing and manipulating relational databases.

## SQL vs NoSQL

Choosing between a SQL (Relational) and NoSQL (Non-Relational) database is a fundamental architectural decision.

-   **SQL Databases** (e.g., PostgreSQL, MySQL) are structured and schema-based. They excel at handling complex relationships and ensuring data integrity through ACID transactions. They typically scale vertically (adding more power to a single server).
-   **NoSQL Databases** (e.g., MongoDB, Redis, Cassandra) offer flexible schemas and are designed for specific data models (documents, key-value, graphs). They excel at high throughput and handling unstructured data. They typically scale horizontally (adding more servers).

## Joins

Joins allow you to combine rows from two or more tables based on a related column between them.

-   **INNER JOIN**: Returns records that have matching values in both tables.

  Visual (A = {1,2,3}, B = {2,3,4}):

  A ∩ B → {2, 3}

  ```text
  Table A: 1,2,3
  Table B:   2,3,4
  Result:    2,3
  ```

-   **LEFT JOIN**: All records from the left table, matched records from the right; unmatched right-side values are NULL.

  Visual:

  A ∪ (A ∩ B) → {1,2,3} (with B NULL for 1)

  ```text
  Result: 1 (B: NULL), 2 (B: present), 3 (B: present)
  ```

-   **RIGHT JOIN**: All records from the right table, matched records from the left; unmatched left-side values are NULL.

  Visual:

  B ∪ (A ∩ B) → {2,3,4} (with A NULL for 4)

  ```text
  Result: 2 (A: present), 3 (A: present), 4 (A: NULL)
  ```

-   **FULL JOIN**: Returns all records when there is a match in either left or right table (combines LEFT and RIGHT).

  Visual:

  A ∪ B → {1,2,3,4}

  ```text
  Result: 1 (B: NULL), 2 (both), 3 (both), 4 (A: NULL)
  ```

-   **CROSS JOIN**: Cartesian product — every row from A combined with every row from B.

  Visual (A has 3 rows, B has 3 rows):

  ```text
  Result: 3 x 3 = 9 rows (every possible pair of A and B)
  ```

## Aggregation

Aggregation functions perform a calculation on a set of values and return a single value.

-   **Functions**: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.
-   **GROUP BY**: Groups rows that have the same values into summary rows. It is often used with aggregate functions (e.g., "Count the number of employees in each department").
-   **HAVING**: Used to filter groups. It is similar to the `WHERE` clause, but `WHERE` filters rows *before* aggregation, while `HAVING` filters groups *after* aggregation.

## Pagination

Pagination is essential for performance when dealing with large datasets.

-   **Limit & Offset**: The simplest method (`LIMIT 10 OFFSET 20`). However, it suffers from performance issues on large datasets because the database must scan and discard the offset rows.
-   **Keyset Pagination (Cursor)**: Uses a unique, sequential column (like an ID or timestamp) to fetch the "next" set of results (`WHERE id > last_seen_id LIMIT 10`). This is much more efficient for large datasets but requires deterministic ordering.
