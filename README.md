# SafePost
 A blog post application build in Java, Spring Boot, Spring Security, OAuth2


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