<div align="center">
  <img src="vault.png" alt="DevVault Logo" width="120" height="120">

  # DevVault 🔐

  **Your vault of developer knowledge**

  A modern, full-stack knowledge sharing platform built for developers, by developers.

  [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Architecture](#architecture) • [API Documentation](#api-documentation)

  ---
</div>

## 📖 About

DevVault is a comprehensive developer knowledge platform that enables technical professionals to share solutions, tutorials, and insights. Built with Spring Boot and React, it demonstrates modern full-stack development practices including JWT authentication, REST API design, Docker containerization, and responsive UI development.

## ✨ Features

### Core Functionality
- **📝 Rich Content Creation** - Write articles with a powerful rich-text editor featuring syntax-highlighted code blocks
- **🖼️ Cover Images** - Upload and manage custom cover images for articles
- **🏷️ Organization** - Categorize and tag content for easy discovery
- **🔍 Search** - Fast full-text search across titles, content, and authors
- **👤 User Profiles** - Customizable profiles with avatars, bio, and social links
- **❤️ Engagement** - Like articles and track popular content
- **📊 Analytics** - View counts and reading time estimates

### User Experience
- **🌓 Dark Mode** - Seamless light/dark theme switching with persistent preference
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **⚡ Fast & Modern** - Built with Vite for lightning-fast development and production builds
- **🎨 Beautiful UI** - Clean, developer-focused interface with JetBrains Mono font and subtle animations

### Technical Highlights
- **🔐 Secure Authentication** - JWT-based stateless authentication with bcrypt password hashing
- **🐳 Docker Ready** - Complete Docker Compose setup for easy deployment
- **📊 Database Migrations** - Flyway for version-controlled database schema management
- **🔄 RESTful API** - Well-structured REST API following best practices
- **🛡️ Role-Based Access** - ADMIN and USER roles with appropriate permissions

## 🛠️ Tech Stack

### Backend
- **Java 21** - Modern Java with latest language features
- **Spring Boot 3.5.5** - Production-ready application framework
- **Spring Security** - Comprehensive authentication and authorization
- **Spring Data JPA** - Database access with Hibernate
- **PostgreSQL 16** - Robust relational database
- **Flyway** - Database migration management
- **JWT (jjwt 0.11.5)** - Stateless authentication tokens
- **MapStruct** - Type-safe bean mapping
- **Lombok** - Reduced boilerplate code
- **Maven** - Dependency management and build tool

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **NextUI** - Beautiful React component library
- **TipTap** - Extensible rich-text editor
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **DOMPurify** - XSS sanitization

### DevOps & Tools
- **Docker & Docker Compose** - Containerization and orchestration
- **Nginx** - Production-ready web server
- **Adminer** - Database management interface
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Docker Desktop installed and running
- Git for version control
- (Optional) Java 21 and Node.js 20 for local development

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devvault.git
   cd devvault
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - Database Admin: http://localhost:8888

### Default Credentials
The application seeds a default admin account:
- Email: `admin@devvault.com`
- Password: `admin123`

⚠️ **Important**: Change these credentials in production!

## 📁 Project Structure

```
devvault/
├── src/main/java/com/mehrdad/SafePost/
│   ├── config/              # Security, CORS, and app configuration
│   ├── controllers/         # REST API endpoints
│   ├── domain/
│   │   ├── entities/        # JPA entities (User, Post, Category, Tag)
│   │   └── dtos/            # Data Transfer Objects
│   ├── repositories/        # Spring Data JPA repositories
│   ├── services/            # Business logic layer
│   ├── security/            # JWT filters and utilities
│   └── mappers/             # Entity ↔ DTO mappers
├── src/main/resources/
│   ├── application.properties           # App configuration
│   └── db/migration/                    # Flyway migrations
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API service layer
│   │   └── App.tsx          # Root component
│   └── public/              # Static assets
├── docker-compose.yml       # Multi-container orchestration
├── Dockerfile              # Backend container
└── README.md
```

## 🏗️ Architecture

### Layered Architecture

DevVault follows a clean, layered architecture pattern:

```
┌─────────────────────────────────────────┐
│         Client (React SPA)              │
│  - Components, Pages, State Management  │
└─────────────────┬───────────────────────┘
                  │ HTTP/JSON (REST API)
┌─────────────────▼───────────────────────┐
│         Controller Layer                │
│  - Request/Response handling            │
│  - Validation, Error handling           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Service Layer                   │
│  - Business logic                       │
│  - Transaction management               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Repository Layer (Spring Data)     │
│  - Data access abstraction              │
│  - Custom queries                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Database (PostgreSQL)           │
│  - Persistent storage                   │
└─────────────────────────────────────────┘
```

### Authentication Flow

```
┌──────────┐                                    ┌──────────┐
│  Client  │                                    │  Server  │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  POST /api/v1/auth/login                      │
     │  { email, password }                          │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                     ┌──────────▼─────────┐
     │                                     │ Authentication     │
     │                                     │ Manager validates  │
     │                                     │ credentials        │
     │                                     └──────────┬─────────┘
     │                                                │
     │  200 OK                                        │
     │  { token: "eyJhbG..." }                        │
     │<───────────────────────────────────────────────┤
     │                                                │
     │  GET /api/v1/posts                             │
     │  Authorization: Bearer eyJhbG...               │
     ├──────────────────────────────────────────────>│
     │                                                │
     │                                     ┌──────────▼─────────┐
     │                                     │ JWT Filter         │
     │                                     │ validates token    │
     │                                     │ sets SecurityContext│
     │                                     └──────────┬─────────┘
     │                                                │
     │  200 OK                                        │
     │  [ { post }, { post }, ... ]                   │
     │<───────────────────────────────────────────────┤
     │                                                │
```

## 🔒 Security

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with 24-hour token expiration
- **Password Security**: Bcrypt hashing with salt rounds
- **Role-Based Access Control**: USER and ADMIN roles
- **CORS Configuration**: Configurable allowed origins
- **XSS Protection**: DOMPurify sanitization on frontend

### Security Configuration
- Public endpoints: `GET /api/v1/posts/**`, `/api/v1/categories/**`, `/api/v1/tags/**`
- Protected endpoints: All POST, PUT, DELETE operations require authentication
- Admin-only: User management, category/tag management

## 📡 API Documentation

### Authentication Endpoints
```
POST   /api/v1/auth/login       # Login and get JWT token
POST   /api/v1/auth/register    # Register new user
GET    /api/v1/auth/me          # Get current user profile
```

### Post Endpoints
```
GET    /api/v1/posts                    # List all published posts
GET    /api/v1/posts/{id}               # Get single post
POST   /api/v1/posts                    # Create new post (auth)
PUT    /api/v1/posts/{id}               # Update post (auth, owner/admin)
DELETE /api/v1/posts/{id}               # Delete post (auth, owner/admin)
GET    /api/v1/posts/drafts             # Get user's draft posts (auth)
POST   /api/v1/posts/{id}/likes         # Toggle like (auth)
```

### Category & Tag Endpoints
```
GET    /api/v1/categories               # List all categories
POST   /api/v1/categories               # Create category (admin)
PUT    /api/v1/categories/{id}          # Update category (admin)
DELETE /api/v1/categories/{id}          # Delete category (admin)

GET    /api/v1/tags                     # List all tags
POST   /api/v1/tags                     # Create tag (admin)
PUT    /api/v1/tags/{id}                # Update tag (admin)
DELETE /api/v1/tags/{id}                # Delete tag (admin)
```

### File Upload Endpoints
```
POST   /api/v1/files/covers             # Upload cover image (auth)
GET    /api/v1/files/covers/{filename}  # Serve cover image
```

### Example Request
```bash
# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@devvault.com","password":"admin123"}'

# Create Post (with JWT token)
curl -X POST http://localhost:8080/api/v1/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title":"Getting Started with Spring Boot",
    "content":"<p>Spring Boot makes it easy...</p>",
    "categoryId":"category-uuid",
    "tagIds":["tag-uuid-1","tag-uuid-2"],
    "status":"PUBLISHED"
  }'
```

## 🧪 Development

### Backend Development
```bash
# Run backend locally (requires PostgreSQL)
cd devvault
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR
./mvnw clean package
```

### Frontend Development
```bash
# Install dependencies
cd frontend
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Migrations
Flyway migrations are located in `src/main/resources/db/migration/`:
- `V1__initial_schema.sql` - Initial database schema
- `V2__add_user_roles.sql` - User roles and permissions
- Add new migrations following the naming pattern

## 🐳 Docker Deployment

### Production Build
```bash
# Build all services
docker-compose build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down
```

### Environment Variables
Configure these in `.env` for production:
```env
# Database
POSTGRES_DB=devvault
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# Backend
JWT_SECRET=your-256-bit-secret-key-here
SPRING_PROFILES_ACTIVE=prod
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# File Storage
FILE_UPLOAD_DIR=/app/uploads/covers
```

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and profiles
- **posts** - Articles and content
- **categories** - Content categorization
- **tags** - Content tagging
- **post_tags** - Many-to-many relationship
- **post_likes** - User likes on posts

### Key Relationships
- User → Posts (one-to-many, author relationship)
- Post → Category (many-to-one)
- Post → Tags (many-to-many via post_tags)
- Post → Likes (many-to-many via post_likes)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Backend: Follow Java conventions, use Lombok for boilerplate reduction
- Frontend: ESLint configuration provided, use TypeScript strictly
- Commits: Use conventional commits format

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- NextUI for the beautiful component library
- TipTap for the extensible editor
- Spring Boot team for the excellent framework
- The open-source community

## 📧 Contact

**Mehrdad Momenizadeh**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

<div align="center">
  Built with ❤️ by developers, for developers

  ⭐ Star this repo if you find it helpful!
</div>
