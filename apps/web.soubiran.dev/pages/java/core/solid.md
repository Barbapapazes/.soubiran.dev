---
id: ef25d512-6541-4994-b734-a1c19474fdd3
title: Solid Principles
description: Learn the SOLID principles of object-oriented design to create maintainable and flexible software systems.
---

SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.

> [!NOTE]
> Examples are in Java, but the principles apply to all object-oriented programming languages.

## Recap

| Principle | Description                     | Key Goal                                                 |
|-----------|---------------------------------|----------------------------------------------------------|
| **S**RP   | Single Responsibility Principle | A class should have one reason to change.                |
| **O**CP   | Open/Closed Principle           | Open for extension, closed for modification.             |
| **L**SP   | Liskov Substitution Principle   | Subtypes must be substitutable for their base types.     |
| **I**SP   | Interface Segregation Principle | Clients shouldn't be forced to depend on unused methods. |
| **D**IP   | Dependency Inversion Principle  | Depend on abstractions, not concretions.                 |

---

## S - Single Responsibility Principle (SRP)

> A class should have only one reason to change.

Each class should have a single responsibility.

```java [Invoice.java]
public class Invoice {
  private final int id;
  // data and domain logic
  public Invoice(int id) { this.id = id; }
  public int getId() { return id; }
}
```

```java [InvoicePrinter.java]
public class InvoicePrinter {
  public void print(Invoice invoice) {
    System.out.println("Printing invoice " + invoice.getId());
  }
}
```

```java [InvoiceRepository.java]
public class InvoiceRepository {
  public void save(Invoice invoice) {
    // persist invoice
  }
}
```

> [!TIP]
> Separate responsibilities: domain, persistence, presentation

## O - Open/Closed Principle (OCP)

> Software entities should be open for extension, but closed for modification.

Extend behavior via interfaces/polymorphism instead of changing existing code.

```java [Shape.java]
public interface Shape { double area(); }
```

```java [Circle.java]
public class Circle implements Shape {
  private final double r;
  public Circle(double r) { this.r = r; }
  public double area() { return Math.PI * r * r; }
}
```

```java [AreaCalculator.java]
import java.util.List;
public class AreaCalculator {
  public double totalArea(List<Shape> shapes) {
    return shapes.stream().mapToDouble(Shape::area).sum();
  }
}
```

Add new shapes without modifying AreaCalculator.

## L - Liskov Substitution Principle (LSP)

> Subtypes must be substitutable for their base types.

A subtype should honor the contract of its base type.

Violation example:

```java [Bird.java]
public class Bird { public void fly() {} }
public class Penguin extends Bird { /* can’t fly */ }
```

Penguin can't be used where Bird.fly() is expected, LSP is violated.

Correct design using interfaces:

```java [Flyable.java]
public interface Flyable { void fly(); }
public class Sparrow implements Flyable { public void fly() { /* fly */ } }
public class Penguin { /* no fly method */ }
```

Use the appropriate abstraction for clients.

## I - Interface Segregation Principle (ISP)

> Clients should not be forced to depend upon interfaces that they do not use.

Prefer small, role-specific interfaces.

Fat interface example (bad):

```java [MultifunctionPrinter.java]
public interface MultifunctionPrinter {
  void print();
  void scan();
  void fax();
}
public class OldPrinter implements MultifunctionPrinter {
  public void print() {}
  public void scan() { throw new UnsupportedOperationException(); }
  public void fax() { throw new UnsupportedOperationException(); }
}
```

Segregated interfaces (good):

```java [Printable.java]
public interface Printable { void print(); }
public interface Scannable { void scan(); }
public interface Faxable { void fax(); }

public class SimplePrinter implements Printable {
  public void print() { /* print */ }
}
```

## D - Dependency Inversion Principle (DIP)

> Depend upon abstractions, not concretions.

High-level modules should depend on interfaces.

```java [ReportFormatter.java]
public interface ReportFormatter { String format(Report r); }
```

```java [HtmlFormatter.java]
public class HtmlFormatter implements ReportFormatter {
  public String format(Report r) { return "<html>...</html>"; }
}
```

```java [ReportGenerator.java]
public class ReportGenerator {
  private final ReportFormatter formatter;
  public ReportGenerator(ReportFormatter formatter) { this.formatter = formatter; }
  public void generate(Report r) {
    String output = formatter.format(r);
    // use output
  }
}
```

Inject different implementations (HTML, JSON, plain text) without changing ReportGenerator.
