# Database Indexing

Indexing is a data structure technique used to quickly locate and access the data in a database table. Indexes are created using a few database columns.

## Overview

-   **Goal**: The primary purpose of an index is to speed up data retrieval (SELECT statements). Without an index, the database must scan the entire table (Sequential Scan) to find the relevant rows.
-   **Trade-off**: While indexes speed up reads, they slow down writes (INSERT, UPDATE, DELETE). Every time you modify the table, the database must also update the indexes. Therefore, you should only index columns that are frequently used in search conditions.

## Types of Indexes

-   **B-Tree (Balanced Tree)**
  - Visual:
    ```text
    [root: 30]
     /        \
    [10,20]   [40,50,60]
     /  \       /   |   \
    L1  L2     L3  L4   L5  (leaf nodes)
    ```
    - Search for 45: root → right child → traverse leaf nodes → find pointer to row
  - Notes: ordered structure, good for `=`, `<`, `>`, `BETWEEN`. Logarithmic lookup `O(log n)`. Supports range scans and ordering.

-   **Hash**
  - Visual:
    ```text
    hash(value) -> bucket index
    buckets:
    0: [id3]
    1: [id7, id12]
    2: []
    3: [id1]
    ```
    - Lookup for `value` → compute `hash(value)` → go to single bucket → scan items in bucket
  - Notes: extremely fast for equality `=` lookups, no range support, not useful for ORDER BY.

-   **GIN (Generalized Inverted Index)**
  - Visual:
    ```text
    token -> posting list
    'apple'  -> [row2, row5, row9]
    'color'  -> [row1, row5]
    'sizes'  -> [row3, row5, row8]
    ```
    - For JSONB/array/doc: tokenization → index tokens → query by token set intersection/containment
  - Notes: ideal for arrays, JSONB and full-text search. Fast multi-value lookups and containment queries, uses posting lists and bitmaps/merge strategies for results.

## Optimization Strategies

-   **Explain / Analyze**: Always use the `EXPLAIN ANALYZE` command to understand how the database executes your query. It reveals whether an index is being used or if a full table scan is occurring.
-   **Composite Indexes**: If you frequently query multiple columns together (e.g., `WHERE first_name = 'John' AND last_name = 'Doe'`), a composite index on `(first_name, last_name)` is more efficient than two separate indexes. The order of columns in the index matters.
-   **Covering Index**: An index that contains all the columns required by a query. In this case, the database can retrieve the data directly from the index without accessing the actual table (Heap), which is significantly faster.
