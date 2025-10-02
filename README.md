# SafePost
 A blog post application build in Java, Spring Boot, Spring Security, OAuth2

## What each piece is for (mental model)

### Entity — Category (DB shape)
- Purpose: maps to the categories table; owns relationships (here, @OneToMany posts).
- Typical contents: JPA annotations, identity (id), fields, relationships, lifecycle callbacks, equality by identity.
- You never expose entities to clients directly.

### DTO — CategoryDto (API shape)
- Purpose: exactly what the client should see (id, name, postCount).
- Typical contents: only public-facing fields, no JPA annotations, often tailored per endpoint.

### Repository — CategoryRepository (data access)
- Purpose: query the DB for Category data.
- Typical contents: findBy…, custom @Query, projections, pagination.
- You return entities or projections, not DTOs.

### Service — CategoryService + Impl (business logic)
- Purpose: orchestrates: chooses the right repo method, enforces rules, handles transactions.
- Typical contents: transactional methods, cross-entity logic, caching, validation hooks.
- Works with entities and/or projections; mapping to DTO can happen here or in controller.

### Mapper — CategoryMapper (conversion glue)
- Purpose: turns Entity/Projection → DTO (and sometimes DTO → Entity).
- Typical contents: MapStruct mappings, small calculated fields (like postCount).

### Controller — CategoryController (HTTP edge)
- Purpose: handles routes, params, status codes; calls service; returns ResponseEntity<DTO>.
- Typical contents: endpoint methods, 2xx/4xx/5xx decisions, headers.

## How they interact
- Client calls GET /api/v1/categories
- Controller (listCategories) calls Service → categoryService.listCategories()
- Service calls Repository → findAllWithPostCount()
- Repository runs JPQL/SQL → returns Category entities (with posts fetched)
- Controller maps List<Category> → List<CategoryDto> using Mapper
- Controller returns ResponseEntity.ok(dtos) → JSON to client

```bash

Below is a simple architecture of how different layers talk to each other for the Category part


        [ HTTP Client ]
              |
              v
+---------------------------+
|   CategoryController      |
|  - routes (/categories)   |
|  - ResponseEntity<DTO>    |
+-------------+-------------+
              |
              v
+---------------------------+
|     CategoryService       |
|  - business logic         |
|  - transactions           |
+-------------+-------------+
              |
              v
+---------------------------+
|    CategoryRepository     |
|  - DB queries (JPA)       |
+-------------+-------------+
              |
              v
+---------------------------+        +------------------+
|     Category Entity       |<------>|     Post Entity  |
|  - JPA mapping            | 1..*   |  (many-to-one)   |
+---------------------------+        +------------------+

   (mapping happens here on the way back)

              ^
              |
+---------------------------+
|      CategoryMapper       |
|  Entity/Proj -> DTO       |
+-------------+-------------+
              |
              v
+---------------------------+
|       CategoryDto         |
|  - API contract           |
+---------------------------+
```

## Spring Security
### With the current config file: 

- GET /api/v1/posts/** → public
- GET /api/v1/categories/** → public
- GET /api/v1/tags/** → public
- POST /api/v1/posts, PUT /api/v1/categories, DELETE /api/v1/tags, etc. → require authentication
- Passwords will be encoded using bcrypt.
- No sessions; you’ll need stateless auth (JWT tokens or Basic auth).

```bash

Client HTTP Request
   |
   v
[ Security Filter Chain ]
   |-- matches URL rules?
   |   |-- /api/v1/posts (GET)? permitAll ✅
   |   |-- anything else? require authentication 🔒
   |
   v
If authenticated -> Controller
Else -> 401 Unauthorized
```

## Stateless Auth
Instead of keeping sessions in memory, every request carries all the information needed.
The server doesn’t “remember” anything.

- JWT (JSON Web Token) Authentication:

Flow:
- User logs in (POST /login with username & password).
- Server verifies credentials, then creates a JWT token (signed, not encrypted).
- Client stores the JWT (usually in localStorage or memory).
- On every request, client sends: 
```bash
  Authorization: Bearer <JWT_TOKEN>
```
- Server verifies the signature (using a secret key).
- If valid → request continues. No DB lookup needed.



## JWT Work Flow

```bash

POST /api/v1/auth/login
{
  "username": "randomUser",
  "password": "secret"
}

   |
   v
Server verifies -> returns JWT:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}

   |
   v
Client stores token, then calls:
GET /api/v1/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

   |
   v
Spring Security verifies token -> if valid -> controller runs

```

## Bean
- A bean = an object managed by Spring (created once, injected everywhere).
- @Bean is a method-level annotation. It tells Spring: “Run this method once at startup, put the returned object in the container, and manage it as a bean.”

```bash

@Configuration class (SecurityConfig)
       |
       |  @Bean methods
       v
+----------------------------+
| Spring IoC Container       |
|   - SecurityFilterChain    |
|   - PasswordEncoder        |
|   - AuthenticationManager  |
+----------------------------+
       |
       |  @Autowired / constructor injection
       v
Other components (Controllers, Services, Filters)

```

## Auth 

1) Login (issue a token)
```bash

Client                  Server
------                  ------------------------------
POST /auth/login  --->  AuthenticationService.authenticate(email, password)
                         └─ uses AuthenticationManager + UserDetailsService
                         (if OK)
                         → generateToken(userDetails)  (signed JWT)
<--- 200 { token }       return token to client
```

2) Use token on protected routes
```bash

Client                             Server
------                             ------------------------------------------
GET /api/... + Authorization: Bearer <JWT>
                            --->  JwtAuthenticationFilter
                                   ├─ extract token
                                   ├─ validate signature + expiry
                                   ├─ load UserDetails
                                   └─ set SecurityContext(Authentication)
                                 → Controller method
<--- 200 JSON
```

## Authorization sample 

### Login to get a token
Suppose the app has a login endpoint:
```bash

POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "mehrdad@example.com",
  "password": "secret123"
}
```

Server response:
```bash

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```
That long string is our JWT.

### Use token in Authorization header
Now when you call a protected endpoint, include the token like this:
```bash

GET /api/v1/posts/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

```

### Server behaviour
- Your JWT filter grabs the Authorization header.
- Strips "Bearer " → leaves just the token.
- Validates signature + expiry.
- If valid → sets user details into the SecurityContext.
- Controller executes normally.
- If invalid/expired → return 401 Unauthorized.



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
