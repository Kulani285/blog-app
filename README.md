# Inkwell Blog CMS

A full-stack blog/CMS application built with **Spring Boot**, **React**, and **MySQL**.

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Backend   | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth      | JWT (jjwt 0.11.5)              |
| Database  | MySQL 8.0 + Hibernate ORM       |
| Frontend  | React 18, React Router v6, Axios |
| Styling   | Custom CSS (Playfair Display + DM Sans) |
| Deploy    | Docker + Docker Compose         |

## Features

- ✦ Public blog with paginated post listings
- ✦ Full-text search across posts
- ✦ Tag-based filtering
- ✦ Author dashboard with post management (CRUD)
- ✦ Rich post editor (title, content, excerpt, cover image, tags, status)
- ✦ JWT-based authentication (register / login)
- ✦ Role-based access (ADMIN, AUTHOR, READER)
- ✦ Post statuses: DRAFT, PUBLISHED, ARCHIVED
- ✦ View counter per post
- ✦ Auto-generated slugs and excerpts
- ✦ Responsive design

## Project Structure

```
blog-app/
├── backend/
│   ├── src/main/java/com/blog/
│   │   ├── entity/          # Post, User, Tag
│   │   ├── repository/      # JPA repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/             # Request/response DTOs
│   │   └── config/          # JWT, Security config
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API layer
│   │   ├── components/      # Navbar, PostCard, ProtectedRoute
│   │   ├── hooks/           # useAuth (AuthContext)
│   │   └── pages/           # Home, PostDetail, PostEditor, Dashboard, Login, Register, Search, TagPage
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## Quick Start

### Option A — Local Development

**Prerequisites:** Java 17+, Node 18+, MySQL 8

#### 1. Database setup
```bash
mysql -u root -p
CREATE DATABASE blogdb;
EXIT;
```

#### 2. Backend
```bash
cd backend
# Edit src/main/resources/application.properties with your DB credentials
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

#### 3. Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Option B — Docker Compose

```bash
# From the blog-app/ root:
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MySQL: localhost:3306

## API Reference

### Auth
| Method | Endpoint             | Body                                    | Auth |
|--------|---------------------|-----------------------------------------|------|
| POST   | /api/auth/register  | { username, email, password, displayName } | ✗ |
| POST   | /api/auth/login     | { username, password }                  | ✗    |

### Posts
| Method | Endpoint               | Description              | Auth   |
|--------|------------------------|--------------------------|--------|
| GET    | /api/posts             | Published posts (paged)  | ✗      |
| GET    | /api/posts/all         | All posts (paged)        | ✓      |
| GET    | /api/posts/{id}        | Post by ID               | ✗      |
| GET    | /api/posts/slug/{slug} | Post by slug             | ✗      |
| POST   | /api/posts             | Create post              | ✓      |
| PUT    | /api/posts/{id}        | Update post              | ✓      |
| DELETE | /api/posts/{id}        | Delete post              | ✓      |
| GET    | /api/posts/search?q=   | Search posts             | ✗      |
| GET    | /api/posts/tag/{tag}   | Posts by tag             | ✗      |

### Tags
| Method | Endpoint   | Description | Auth |
|--------|------------|-------------|------|
| GET    | /api/tags  | All tags    | ✗    |

## Environment Variables (Backend)

| Variable                     | Default                              |
|------------------------------|--------------------------------------|
| spring.datasource.url        | jdbc:mysql://localhost:3306/blogdb   |
| spring.datasource.username   | root                                 |
| spring.datasource.password   | yourpassword                         |
| app.jwt.secret               | (base64 encoded 32+ byte secret)     |
| app.jwt.expiration           | 86400000 (24h in ms)                 |

## First Admin User

After starting the app, register normally via `/register`. To promote a user to ADMIN,
update the database directly:

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'yourusername';
```

## Next Steps

- [ ] Rich text editor (Quill / TipTap)
- [ ] Image upload to S3
- [ ] Email notifications
- [ ] Comment system
- [ ] RSS feed
- [ ] SEO meta tags / Open Graph
