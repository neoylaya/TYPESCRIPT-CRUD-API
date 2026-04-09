# TypeScript CRUD API

A REST API built with Node.js, Express, TypeScript, and MySQL using Sequelize ORM.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** MySQL + Sequelize
- **Validation:** Joi
- **Security:** bcryptjs, JWT

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/typescript-crud-api.git
cd typescript-crud-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the database
Create a `config.json` file in the root directory:
```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "your_db_user",
    "password": "your_db_password",
    "database": "typescript_crud_api"
  }
}
```

### 4. Run the development server
```bash
npm run start:dev
```
Server runs at `http://localhost:4000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create a new user |
| PUT | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

---

## Example Request

```bash
# Create a user
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mr",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "password": "secret123",
    "confirmPassword": "secret123",
    "role": "User"
  }'
```

---

## Scripts

```bash
npm run start:dev   # Run with auto-reload (development)
npm run build       # Compile TypeScript to JavaScript
npm run test        # Run API tests
```

---
