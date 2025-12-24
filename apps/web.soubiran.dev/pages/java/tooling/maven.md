# Maven

Maven is a build automation and dependency management tool, primarily used for Java projects. It is conceptually similar to `npm` in the JavaScript ecosystem.

## Core Concepts

### Project Object Model (POM)
The `pom.xml` file is the heart of a Maven project. It contains information about the project and configuration details used by Maven to build the project.
- **GroupId**: A unique identifier for your project's group, typically following the reverse domain name convention (e.g., `com.company.project`).
- **ArtifactId**: The name of the jar file without the version.
- **Version**: The version of the artifact (e.g., `1.0.0-SNAPSHOT`).

### Dependency Scopes
When adding a dependency, you can specify a `scope` to control when that dependency is available on the classpath:

- **`compile`** (Default): The dependency is available in all classpaths (compilation, testing, and runtime) and is packaged with the application.
- **`provided`**: The dependency is needed for compilation but is expected to be provided by the runtime environment (e.g., the Servlet API provided by Tomcat). It is **not** packaged with the application.
- **`runtime`**: The dependency is not needed for compilation but is required for execution (e.g., a JDBC driver implementation).
- **`test`**: The dependency is only available for compiling and running tests (e.g., JUnit, Mockito).

## Release Management
Maven includes a release plugin that automates the release process. It handles tasks such as:
1.  Checking for uncommitted changes.
2.  Updating the version in `pom.xml` to a release version.
3.  Tagging the code in the version control system (Git).
4.  Deploying the artifacts to a repository (like Nexus or Artifactory).
5.  Updating the version to the next development snapshot.
