# JavaBean

A JavaBean is a standard programming convention used in Java. It is not a special syntax, but rather a set of rules for defining classes that allows them to be easily manipulated by tools, libraries, and frameworks.

## Key Characteristics

To be considered a JavaBean, a class must follow these conventions:

1.  **No-Argument Constructor**: The class must have a public, no-argument constructor. This allows frameworks (like Spring or Hibernate) to instantiate the class using reflection (`Class.newInstance()`).
2.  **Properties**: Data should be stored in private fields and exposed via public getter and setter methods.
    *   **Naming Convention**: For a field named `firstName`, the getter should be `getFirstName()` and the setter `setFirstName()`. For boolean fields, the getter can be `isActive()`.
3.  **Serializable**: The class should implement the `java.io.Serializable` interface. This allows the object's state to be saved (persisted) or transferred over a network.

## Why use JavaBeans?

The JavaBean standard enables **introspection**. Libraries can inspect a class at runtime to discover its properties and methods. This is heavily used in:
*   **JSON Serialization**: Libraries like Jackson use getters to convert objects to JSON.
*   **ORM Frameworks**: Hibernate uses getters/setters or direct field access to map objects to database tables.
*   **Dependency Injection**: Spring uses setters (in setter injection) to inject dependencies.
