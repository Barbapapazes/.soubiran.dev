---
id: c808aec9-a10d-4dfd-8e70-62c63c17d997
title: Equals and HashCode
description: Understand the importance of overriding equals() and hashCode() in Java, and how to implement them correctly to ensure proper behavior in collections.
---

In Java, `equals()` and `hashCode()` are fundamental methods defined in the `Object` class. These methods are used to determine object equality and to provide a hash code representation of an object, respectively. The hash code is primarily used in hash-based [collections](/java/core/collections) like `HashMap`, `HashSet`, and `Hashtable`.

The contract between `equals()` and `hashCode()` is crucial for the correct functioning of these collections. If two objects are considered equal according to the `equals()` method, they must return the same hash code from the `hashCode()` method. But if two objects have the same hash code, they are not necessarily equal.

> [!NOTE]
> Two objects can have the same hash code because of the limited range of hash codes (32-bit integers) compared to the vast number of possible objects. This is called a hash collision. Collisions handled gracefully by hash-based collections using buckets and linked lists or trees to store multiple objects that share the same hash code. So this collision only affects performance, not correctness.

The default implementation of `equals()` in the `Object` class checks for reference equality (i.e., whether two references point to the same object in memory). The default `hashCode()` method typically returns a unique integer based on the object's memory address.

Depending on the business logic, this can be insufficient. For example, two `Person` objects with the same `id` or the same social security number should be considered equal, even if they are different instances in memory.

To resolve this, you can override both `equals()` and `hashCode()` in your class.

## Overriding `equals()` and `hashCode()`

It's important to always override both methods together to maintain the contract.

> [!TIP]
> Use IDEs or libraries like Lombok to auto-generate these methods to avoid common pitfalls.

```java [Person.java]
class Person {
  @Override
  public boolean equals(Object obj) {
      if (obj == null || getClass() != obj.getClass()) return false; // Null and type check
      Person person = (Person) obj;
      return Objects.equals(id, person.id); // Business logic equality
  }

  @Override
  public int hashCode() {
      return Objects.hash(id); // Consistent with equals()
  }
}
```
