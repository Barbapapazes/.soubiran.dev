# JVM Architecture

The Java ecosystem is built around three core components that are often confused. Understanding the distinction between them is the first step to mastering Java.

## Components

### JVM (Java Virtual Machine)
The JVM is the engine that executes Java bytecode. It provides platform independence, meaning that code compiled on one machine can run on any other machine that has a JVM. It handles memory management (Garbage Collection) and security.

### JRE (Java Runtime Environment)
The JRE is the package required to **run** a Java application. It includes:
- The **JVM**.
- The **Standard Class Libraries** (e.g., `java.lang`, `java.util`).
- Configuration files and property settings.

### JDK (Java Development Kit)
The JDK is the package required to **develop** Java applications. It includes:
- The **JRE**.
- Development tools such as the compiler (`javac`), the debugger (`jdb`), and documentation generator (`javadoc`).

## HotSpot
HotSpot is the most widely used JVM implementation, maintained by Oracle and the OpenJDK community. It gets its name from its core performance feature:

- **JIT (Just-In-Time) Compilation**: Instead of interpreting bytecode line-by-line, HotSpot compiles frequently executed code ("hot spots") into native machine code at runtime.
- **Adaptive Optimization**: The JVM profiles the running application and re-optimizes code on the fly based on actual usage patterns.

## Multiple Vendors
Since the Java specifications are open, multiple vendors provide their own builds of the JDK.
- **Oracle JDK**: The official commercial build from Oracle.
- **OpenJDK**: The open-source reference implementation.
- **Amazon Corretto**, **Azul Zulu**, **Eclipse Temurin**: Production-ready builds of OpenJDK with different support models.

**Recommendation**: For most projects, **OpenJDK** or **Amazon Corretto** are safe, free, and reliable choices.
