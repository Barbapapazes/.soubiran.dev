# Collections & Functional Operations

## Recap

| Feature | Description | Example |
|---------|-------------|---------|
| **List** | Ordered collection | `listOf(1, 2, 3)` |
| **Set** | Unique elements | `setOf(1, 2, 3)` |
| **Map** | Key-value pairs | `mapOf("a" to 1)` |
| **Mutable** | Modifiable collection | `mutableListOf()` |
| **Sequence** | Lazy evaluation | `list.asSequence()` |
| **Range** | Interval of values | `1..10`, `1..<10` |

---

## Read-only vs Mutable

By default, Kotlin encourages the use of read-only collections to promote immutability and thread safety.

| Type | Read-only | Mutable |
| :--- | :--- | :--- |
| **List** | `listOf(1, 2)` | `mutableListOf(1, 2)` |
| **Set** | `setOf(1, 2)` | `mutableSetOf(1, 2)` |
| **Map** | `mapOf("a" to 1)` | `mutableMapOf("a" to 1)` |

> [!IMPORTANT]
> A `List` is not necessarily immutable; it is just a read-only view. The underlying implementation might still be mutable (e.g., if cast from a `MutableList`).

---

## Functional Operators

Kotlin collections provide a powerful API for functional-style transformations.

### Transformation
- `map`: Transforms each element.
- `flatMap`: Transforms each element into a collection and flattens the result.
- `associateBy`: Creates a map using a key selector.

### Filtering
- `filter`: Keeps elements matching a predicate.
- `filterNotNull`: Removes null elements.
- `distinct`: Removes duplicates.

### Terminal Operations
- `find` / `firstOrNull`: Returns the first matching element.
- `any` / `all` / `none`: Predicate checks across the collection.
- `fold` / `reduce`: Accumulates values starting from an initial value.

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)
val doubledEvens = numbers
    .filter { it % 2 == 0 }
    .map { it * 2 } // [4, 8]
```

---

## Sequences (Lazy Collections)

For large collections or complex chains of operations, `Sequence` provides lazy evaluation, similar to Java `Stream`.

```kotlin
val sequence = numbers.asSequence()
    .filter { it % 2 == 0 }
    .map { it * 2 }
    .toList() // Operations are only executed here
```

---

## Ranges and Progressions

Ranges allow you to represent a sequence of values.

- `1..10`: Inclusive range [1, 10].
- `1..<10`: Range [1, 10) (until).
- `10 downTo 1`: Decreasing range.
- `1..10 step 2`: Range with a custom step (1, 3, 5, 7, 9).

```kotlin
if (x in 1..10) { ... }

for (i in 1..5) { print(i) } // 12345
```
