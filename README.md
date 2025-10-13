# Task Management API - NestJS GraphQL

A comprehensive Task Management API built with NestJS, GraphQL, PostgreSQL, and Redis. This application extends an existing event management system to include project and task management capabilities.

## Features

### User Management
- User registration and authentication
- JWT token-based authentication (1-hour validity)

### Project Management
- Create projects with name and description
- Add members to projects
- Project ownership and member management

### Task Management
- Create tasks within projects
- Assign tasks to project members
- Update task status (pending, in-progress, completed)
- Soft delete tasks
- Get user tasks with pagination and search
- Redis caching (1-minute TTL)
- PostgreSQL stored procedure integration

## Tech Stack

- **Backend**: NestJS (Node.js framework)
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL with Sequelize ORM
- **Cache**: Redis with cache-manager
- **Authentication**: JWT with Passport
- **Language**: TypeScript

## Requirements Met

**User Management**
- Register User (username, email, hashed password)
- Login User (returns JWT token valid for 1 hour)

**Projects & Tasks (Authenticated APIs)**
- Create Project (name, description, owned by logged-in user)
- Add Members to Project (requires project_members table)
- Create Task under Project (title, description, status, assignee)
- Get My Project Tasks (pagination, search, Redis cache, stored procedure)
- Update Task (creator/assignee can update status/description)
- Delete Task (soft delete with deleted flag)

**Database Schema**
- users ↔ projects: Many-to-many via project_members
- projects ↔ tasks: One-to-many
- users ↔ tasks: One-to-many (as assignees)

**PostgreSQL Stored Procedure**
- `sp_get_user_tasks` with pagination, search, and proper output format

## Database Schema

### Tables Created
- `projects` - Project information and ownership
- `project_members` - Many-to-many relationship between users and projects
- `tasks` - Task information with project association and user assignment

### Relationships
- Users can own multiple projects
- Users can be members of multiple projects
- Projects can have multiple tasks
- Tasks belong to one project
- Tasks can be assigned to one user

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Redis server

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Create a PostgreSQL database named `nestjs-graphql`
2. Start the application - Sequelize will auto-create tables
3. Run the stored procedure creation script:

### 3. Start Redis Server

### 4. Run the Application

#### Development Mode
```bash
npm run dev
```

The server will start at `http://localhost:8001`
GraphQL Playground available at `http://localhost:8001/graphql`

```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build the application
npm run build

```

## Architecture

### Module Structure
- **AuthModule** - JWT authentication and guards
- **UsersModule** - User management and registration
- **ProjectsModule** - Project creation and member management
- **TasksModule** - Task CRUD operations with caching
- **RedisCacheModule** - Redis caching implementation
- **DatabaseModule** - Sequelize configuration and models