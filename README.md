# 🚼 DevPulse

> A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

**Live URL:** `https://devpulse.onrender.com`

---

## ✨ Features

- 🔐 JWT-based authentication with role-based access control
- 👥 Two user roles: `contributor` and `maintainer`
- 🐛 Create and manage bug reports & feature requests
- 🔍 Filter issues by type and status; sort by newest or oldest
- 🔒 Password hashing with bcrypt
- 📦 Modular architecture with clean separation of concerns
- ✅ Strict input validation with meaningful error responses

---

## 🛠️ Tech Stack

| Technology        | Purpose                          |
|-------------------|----------------------------------|
| Node.js (LTS 24+) | Runtime environment              |
| TypeScript        | Strongly-typed JavaScript        |
| Express.js        | HTTP server & modular routing    |
| PostgreSQL        | Relational database (NeonDB)     |
| `pg`              | Native PostgreSQL driver         |
| Raw SQL           | Direct `pool.query()` — no ORM   |
| bcrypt            | Password hashing (salt: 10)      |
| jsonwebtoken      | JWT generation & verification    |
| http-status-codes | Consistent HTTP status codes     |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/devpulse.git
cd devpulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
CONNECTIONSTRING = your_neondb_connection_string
NODE_ENV = your node status
PORT=5000
JWT_SECRET=your_jwt_secret_key
```


### 5. Run the Server

```bash
# Development
npm run dev

# Production
npm run build
node dist/server.js
```

Server will start at: `http://localhost:5000`

---

## 🌐 API Endpoints

### 🔹 Authentication

| Method | Endpoint            | Access  | Description              |
|--------|---------------------|---------|--------------------------|
| POST   | `/api/auth/signup`  | Public  | Register a new user      |
| POST   | `/api/auth/login`   | Public  | Login and receive JWT    |

### 🔹 Issues

| Method | Endpoint          | Access                  | Description                          |
|--------|-------------------|-------------------------|--------------------------------------|
| POST   | `/api/issues`     | Authenticated           | Create a new issue                   |
| GET    | `/api/issues`     | Public                  | Get all issues (filter + sort)       |
| GET    | `/api/issues/:id` | Public                  | Get a single issue by ID             |
| PATCH  | `/api/issues/:id` | Authenticated           | Update an issue                      |
| DELETE | `/api/issues/:id` | Maintainer only         | Delete an issue permanently          |

### Query Parameters for `GET /api/issues`

| Param    | Values                              | Default   |
|----------|-------------------------------------|-----------|
| `sort`   | `newest`, `oldest`                  | `newest`  |
| `type`   | `bug`, `feature_request`            | —         |
| `status` | `open`, `in_progress`, `resolved`   | —         |

### Authorization Header Format

```
Authorization: <JWT_TOKEN>
```

---

## 🗄️ Database Schema Summary

### `users` Table

| Column       | Type          | Constraints                                  |
|--------------|---------------|----------------------------------------------|
| `id`         | SERIAL        | PRIMARY KEY, auto-increment                  |
| `name`       | VARCHAR(100)  | NOT NULL                                     |
| `email`      | VARCHAR(255)  | NOT NULL, UNIQUE                             |
| `password`   | VARCHAR(255)  | NOT NULL, bcrypt hashed                      |
| `role`       | VARCHAR(15)   | DEFAULT `contributor`, CHECK IN (`contributor`, `maintainer`) |
| `created_at` | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP                    |
| `updated_at` | TIMESTAMP     | Auto-refreshed via trigger                   |

### `issues` Table

| Column        | Type          | Constraints                                              |
|---------------|---------------|----------------------------------------------------------|
| `id`          | SERIAL        | PRIMARY KEY, auto-increment                              |
| `title`       | VARCHAR(150)  | NOT NULL                                                 |
| `description` | TEXT          | NOT NULL, min 20 characters                              |
| `type`        | VARCHAR(50)   | NOT NULL, CHECK IN (`bug`, `feature_request`)            |
| `status`      | VARCHAR(20)   | DEFAULT `open`, CHECK IN (`open`, `in_progress`, `resolved`) |
| `reporter_id` | INT           | NOT NULL, references `users.id` (app-level validation)  |
| `created_at`  | TIMESTAMP     | DEFAULT CURRENT_TIMESTAMP                                |
| `updated_at`  | TIMESTAMP     | Auto-refreshed via trigger                               |

---

## 👥 Role & Permission Matrix

| Action                        | Contributor        | Maintainer |
|-------------------------------|--------------------|------------|
| Register / Login              | ✅                 | ✅         |
| Create issue                  | ✅                 | ✅         |
| View all issues               | ✅                 | ✅         |
| Update own issue (open only)  | ✅                 | ✅         |
| Update any issue              | ❌                 | ✅         |
| Change issue status           | ❌                 | ✅         |
| Delete any issue              | ❌                 | ✅         |

---

## 📁 Project Structure

```
devpulse/
├── src/
│   ├── config/
│   │   └── index.ts                # env config
│   ├── db/ 
│   │   └── index.ts                # NeonDB pool connection
│   ├── middleware/
│   │   ├── auth.ts                 # JWT authentication & role guard
│   │   └── globalErrorHandler.ts   # Global error handle
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   └── auth.routes.ts 
│   │   │   └── auth.service.ts
│   │   └── issues/
│   │   │   ├── issues.controller.ts
│   │   │   ├── issues.interface.ts
│   │   │   └── issues.routes.ts 
│   │   │   └── issues.service.ts
│   ├── types/
│   │   └── index.ts                # types define
│   ├── utils/
│   │   └── sendResponse.ts         # Unified success/error response helpers
│   └── app.ts                      # Express app entry point
│   └── server.ts                   # Server entry point
├── .env
├── package.json
└── tsconfig.json
```

---

## 📬 Response Format

**Success**
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

---

## 📝 License

This project is for educational/assignment purposes.