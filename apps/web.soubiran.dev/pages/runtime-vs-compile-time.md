# Runtime vs Compile Time

The runtime and compile-time are two distinct phases in the lifecycle of a program.

For Java, the **compile-time** refers to the period when the Java source code (`.java` files) is translated into bytecode (`.class` files) by the Java compiler (`javac`). This phase includes syntax checking, type checking, and code generation.

For TypeScript, the compile-time refers to the period when TypeScript code (`.ts` files) is transpiled into JavaScript (`.js` files) by the TypeScript compiler (`tsc`). This phase includes type checking and code transformation.

> [!TIP]
> Sometimes, the term "transpiled" is used instead of "compiled" for languages like TypeScript that convert to another high-level language (JavaScript) rather than machine code.

> [!NOTE]
> Instead of "compile-time", we sometimes use the term "build-time" to encompass the entire build process, which may include additional steps like bundling, minification, and optimization.

Whether it's Java or TypeScript, the **runtime** refers to the period when the compiled code is executed by the Java Virtual Machine (JVM) for Java or by a JavaScript engine (like V8 in Node.js or browsers) for TypeScript.

This distinction is important because tools and libraries may operate at either compile-time or runtime, affecting how and when they can modify or interact with the code.
