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