# Design Patterns & Common Practices

Design patterns are typical solutions to common problems in software design. They are like pre-made blueprints that you can customize to solve a recurring design problem in your code.

## Common Design Patterns

### Creational Patterns
These patterns deal with object creation mechanisms, trying to create objects in a manner suitable to the situation.
- **Builder**: Separates the construction of a complex object from its representation. Useful when an object has many optional parameters.
- **Singleton**: Ensures a class has only one instance and provides a global point of access to it.
- **Factory Method**: Defines an interface for creating an object, but lets subclasses alter the type of objects that will be created.

### Structural Patterns
These patterns explain how to assemble objects and classes into larger structures while keeping these structures flexible and efficient.
- **Facade**: Provides a simplified interface to a library, a framework, or any other complex set of classes.
- **Proxy**: Provides a substitute or placeholder for another object. A proxy controls access to the original object, allowing you to perform something either before or after the request gets through to the original object.
- **Adapter**: Allows objects with incompatible interfaces to collaborate.

### Behavioral Patterns
These patterns are concerned with algorithms and the assignment of responsibilities between objects.
- **Strategy**: Defines a family of algorithms, puts each of them into a separate class, and makes their objects interchangeable.
- **Observer**: Lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they're observing.
