# Lombok

[Project Lombok](https://projectlombok.org/) is a Java library that helps to reduce boilerplate code by generating common methods (getters, setters, constructors, etc.) at compile time using annotations.

```java {4,5}
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {

    private String name;

    private int age;
}
```

This is equivalent to writing:

```java {5-7,9-11,13-16,18-21}
public class User {
    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

## How it Works

Unlike Spring, which uses runtime reflection, or AspectJ, which uses bytecode weaving, Lombok works at [compile-time](/runtime-compile-time).

1.  **Annotation Processing**: Lombok registers itself as an annotation processor with the Java compiler (`javac`).
2.  **AST Modification**: When the compiler parses your code into an Abstract Syntax Tree (AST), Lombok scans for its annotations (like `@Getter`).
3.  **Code Generation**: It modifies the AST by injecting new nodes (methods, constructors) directly into the tree.
4.  **Bytecode Generation**: The compiler then continues its work, generating bytecode from the modified AST. The resulting `.class` file contains the methods as if you had written them yourself.

## Common Annotations

These annotations are frequently used, especially in data classes like Entities or DTOs:

- **`@Getter` / `@Setter`**: Generates public getter and setter methods for fields.
- **`@ToString`**: Generates a `toString()` method including all non-static fields.
- **`@NoArgsConstructor` / `@AllArgsConstructor`**: Generates constructors with no arguments or all arguments.
- **`@Builder`**: Implements the Builder pattern for the class, allowing for fluent object creation.

> [!TIP]
> Now that records are available in Java (since Java 14), consider using them for simple data carriers. Records automatically generate constructors, accessors, `equals()`, `hashCode()`, and `toString()` methods.

<!--

TODO:

## Comparison with Other Tools

| Tool | Mechanism | Timing |
|------|-----------|--------|
| **Lombok** | AST Modification | Compile Time |
| **Spring** | Reflection & Proxies | Runtime |
| **AspectJ** | Bytecode Weaving | Compile/Load Time |

-->
