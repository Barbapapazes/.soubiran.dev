# Security Overview

Application security is a broad topic, but it generally revolves around two core concepts: Authentication and Authorization.

## Core Concepts

### Authentication (AuthN)
**"Who are you?"**
Authentication is the process of verifying the identity of a user or system. Common methods include:
-   **Passwords**: The most common method.
-   **MFA (Multi-Factor Authentication)**: Combining something you know (password) with something you have (phone).
-   **SSO (Single Sign-On)**: Logging in once to access multiple applications.

### Authorization (AuthZ)
**"What are you allowed to do?"**
Authorization happens *after* authentication. It determines if the authenticated user has the permission to access a specific resource or perform an action.
-   **Role-Based Access Control (RBAC)**: Users are assigned roles (e.g., `ADMIN`, `USER`), and permissions are assigned to roles.

## Spring Security

Spring Security is the de-facto standard for securing Spring applications. It is powerful and highly customizable.

### The Filter Chain
Spring Security works by inserting a chain of filters into the Servlet container. Every incoming HTTP request must pass through this chain before it reaches your Controller.
-   **Authentication Filter**: Checks for credentials (e.g., Basic Auth header, JWT token).
-   **Authorization Filter**: Checks if the authenticated user has the required role to access the requested path.

### Key Interfaces
-   **`UserDetails`**: Represents the user information (username, password, authorities).
-   **`UserDetailsService`**: A service that loads user data from a source (e.g., database).
-   **`GrantedAuthority`**: Represents a permission or role granted to the user.

### Modern Standards
-   **OAuth2**: An authorization framework that enables applications to obtain limited access to user accounts on an HTTP service (like Facebook or GitHub).
-   **OIDC (OpenID Connect)**: An identity layer on top of OAuth 2.0. It allows clients to verify the identity of the End-User.
