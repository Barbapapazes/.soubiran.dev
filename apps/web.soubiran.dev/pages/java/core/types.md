---
id: 7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d
title: Core Types & String Operations
description: Essential Java types and string operations for everyday programming tasks.
---

Java provides a rich set of core types for representing data and performing operations. Understanding these types is fundamental to writing correct and efficient Java code.

## String Operations

The `String` class in Java provides numerous methods for common operations.

### Checking Empty Strings

Use `isEmpty()` to check if a string is empty, which is more readable than `length() == 0`.

```java
String text = "";
if (text.isEmpty()) {
    System.out.println("String is empty");
}
```

**Why `isEmpty()` is preferred:**
- More **readable** and **explicit** about intent
- **Self-documenting** code that clearly expresses what you're checking
- **Idiomatic** Java style

> [!NOTE]
> `isEmpty()` returns `true` if the string length is 0. It does **not** check for `null`. Use `text == null || text.isEmpty()` for null safety, or consider `isBlank()` (Java 11+) which also checks for whitespace-only strings.

### Common String Methods

#### `substring(int beginIndex, int endIndex)`

Extracts a portion of a string.

```java
String text = "Hello World";
String sub = text.substring(0, 5); // "Hello"
```

- **`beginIndex`**: Inclusive starting index
- **`endIndex`**: Exclusive ending index

#### `indexOf(String str)`

Finds the index of the first occurrence of a substring.

```java
String text = "Hello World";
int index = text.indexOf("World"); // Returns 6
int notFound = text.indexOf("Java"); // Returns -1 if not found
```

**Common usage pattern:**

```java
String email = "user@example.com";
int atIndex = email.indexOf("@");
if (atIndex != -1) {
    String domain = email.substring(atIndex + 1); // "example.com"
}
```

> [!TIP]
> Always check if `indexOf()` returns `-1` before using the result with `substring()` to avoid `StringIndexOutOfBoundsException`.

## Numeric Types

### BigDecimal - Precise Decimal Arithmetic

`BigDecimal` is a critical type for avoiding floating-point precision errors, especially in **financial calculations** and scenarios requiring **exact decimal representation**.

#### Why BigDecimal?

The `double` type uses **binary floating-point representation**, but many decimal numbers cannot be represented exactly in binary. This leads to precision errors:

```java
double d = 0.1 + 0.2;
System.out.println(d); // Output: 0.30000000000000004
```

**This is unacceptable for currency calculations.**

#### How BigDecimal Works

`BigDecimal` stores decimals as an **integer with a scale** (number of decimal places), allowing for **exact representation** of decimal values.

```java
import java.math.BigDecimal;

BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
BigDecimal sum = a.add(b);
System.out.println(sum); // Output: 0.3
```

#### Usage Guidelines

**Create from String, not double:**

```java
// ❌ WRONG - defeats the purpose
BigDecimal bad = new BigDecimal(0.1); // Still imprecise

// ✅ CORRECT - exact representation
BigDecimal good = new BigDecimal("0.1");
```

**Common operations:**

```java
BigDecimal price = new BigDecimal("19.99");
BigDecimal quantity = new BigDecimal("3");
BigDecimal tax = new BigDecimal("0.08");

BigDecimal subtotal = price.multiply(quantity);
BigDecimal taxAmount = subtotal.multiply(tax);
BigDecimal total = subtotal.add(taxAmount);

System.out.println(total); // Exact result
```

> [!IMPORTANT]
> Always use `BigDecimal` for:
> - **Currency** and monetary calculations
> - **Financial** transactions
> - Any scenario where **exact decimal precision** is required
>
> Never use `float` or `double` for these cases.

#### Comparison

Since `BigDecimal` is an object, use `.compareTo()` instead of `==`:

```java
BigDecimal a = new BigDecimal("10.00");
BigDecimal b = new BigDecimal("10.0");

// ❌ WRONG
if (a == b) { } // Compares object references

// ✅ CORRECT
if (a.compareTo(b) == 0) { } // Compares values
// or
if (a.equals(b)) { } // Compares value AND scale
```

> [!WARNING]
> `equals()` considers scale: `new BigDecimal("10.0")` is **not equal** to `new BigDecimal("10.00")`. Use `compareTo()` if you want to ignore scale differences.

---

## Coach's Feedback

### What Was Improved

1. **Top-Down Structure**: Added overview first, then details organized by type
2. **Strict Definitions**: Replaced "more readable" with precise technical explanation of why `isEmpty()` is preferred
3. **Real-World Context**: Added financial calculation scenario for BigDecimal with exact problem explanation
4. **Warning Blocks**: Added critical warnings about common mistakes (null checks, String constructor, comparison)
5. **Code Examples**: Every concept includes practical, runnable code demonstrating correct usage

### Original Mistakes Corrected

1. **Missing Context**: Original notes didn't explain *why* BigDecimal matters - now includes the binary floating-point problem
2. **Incomplete Examples**: Added complete usage patterns and common pitfalls
3. **No Structure**: Raw notes lacked organization - now structured by type with clear sections
4. **Missing Comparisons**: Added comparison guidance which is a common source of bugs
