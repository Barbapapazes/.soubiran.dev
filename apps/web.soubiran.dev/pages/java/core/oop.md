# Object-Oriented Programming in Java

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code: data in the form of fields (often known as attributes or properties), and code in the form of procedures (often known as methods).

## Core Concepts

Understanding the distinction between class, object, and instance is fundamental:

- **Class**: A blueprint or template for creating objects. It defines the properties and behaviors that the objects created from the class will have.
- **Object**: An instance of a class. It is a concrete entity created based on the class blueprint.
- **Instance**: A specific realization of any object. The terms "object" and "instance" are often used interchangeably.

## OOP Principles

There are four main pillars of OOP that you should master:

### Encapsulation
Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), and restricting access to some of the object's components. This is typically achieved using access modifiers (`private`, `protected`, `public`). It protects the internal state of an object and only exposes a controlled interface.

### Inheritance
Inheritance is a mechanism where a new class derives properties and characteristics from an existing class. It promotes code reuse.
> [!NOTE]
> Java supports single class inheritance (a class can extend only one other class) but multiple interface inheritance (a class can implement multiple interfaces).

### Polymorphism
Polymorphism is the ability of an object to take on many forms. In Java, this primarily manifests in two ways:
- **Overloading**: Multiple methods with the same name but different parameters.
- **Overriding**: A subclass provides a specific implementation of a method that is already defined in its superclass.

### Abstraction
Abstraction involves hiding complex implementation details and showing only the essential features of the object. It reduces complexity and allows the programmer to focus on interactions at a higher level. Abstract classes and interfaces are the primary tools for abstraction in Java.

## Interfaces

Interfaces define behavioral contracts. They specify *what* a class must do, but not *how* it does it.
Since Java 8, interfaces have evolved to include **default** and **static** methods, allowing them to provide some implementation logic, not just abstract method signatures.

## Composition vs Inheritance

A common design principle is to **prefer composition over inheritance**.

- **Composition ("Has-a")**: This implies a strong ownership relationship where the part depends on the whole. It is generally more flexible than inheritance because behavior can be changed at runtime by swapping components.
- **Inheritance ("Is-a")**: This implies a strict hierarchy. Overusing inheritance can lead to the "fragile base class" problem, where changes in the superclass inadvertently break subclasses.

## Practical Rules

### Tell, Don't Ask
This principle suggests that instead of asking an object for data and acting on it (e.g., `if (user.isAdmin()) { ... }`), you should tell the object what to do (e.g., `user.performAdminTask()`). This keeps the logic encapsulated within the object that owns the data.
