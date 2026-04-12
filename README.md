<<<<<<< HEAD
#  typescript-crud-api

A fully-typed REST API for user management, powered by **Express** and **MySQL** — built as part of a hands-on TypeScript learning activity.

---

##  Built With

| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Server runtime with static typing |
| Express.js | HTTP routing and middleware |
| MySQL + Sequelize | Relational database and ORM |
| Joi | Request body validation |
| bcryptjs | Password hashing |
| JWT | Token-based authentication |

---

##  Quick Start

**Clone and install**
```bash
git clone https://github.com/neoylaya/typescript-crud-api.git
cd typescript-crud-api
npm install
```

**Set up your database config**

Create a `config.json` file at the root of the project:
```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "your_password",
    "database": "typescript_crud_api"
  },
  "jwtSecret": "your_secret_key"
}
```

>  `config.json` is listed in `.gitignore` — never commit your credentials.

**Start the server**
```bash
npm run start:dev
```
Visit `http://localhost:4000` 

---

##  Project Structure
src/
├── _helpers/
│   ├── db.ts              # Sequelize initialization
│   └── role.ts            # Role enum (Admin / User)
├── _middleware/
│   ├── errorHandler.ts    # Global error handling
│   └── validateRequest.ts # Joi request validation
├── users/
│   ├── user.model.ts      # Sequelize User model
│   ├── user.service.ts    # Business logic
│   └── users.controller.ts# Route handlers
└── server.ts              # App entry point
---

##  API Reference

Base URL: `http://localhost:4000`

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/users` | Fetch all users |
| `GET` | `/users/:id` | Fetch a single user |
| `POST` | `/users` | Register a new user |
| `PUT` | `/users/:id` | Update user details |
| `DELETE` | `/users/:id` | Remove a user |

---

##  Sample Usage

**Register a new user**
```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mr",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "secret123",
    "confirmPassword": "secret123",
    "role": "User"
  }'
```

**Expected response**
```json
{ "message": "User created" }
```

---

##  Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start dev server with auto-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run compiled production build |
| `npm run test` | Run API tests |

---

##  Author

**Josh Neo A. Ylaya**  
GitHub: [@neoylaya](https://github.com/neoylaya)
=======
# TypeScript CRUD API

A RESTful CRUD API built with **TypeScript**, **Express**, **Sequelize**, and **MySQL**.

##  Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** MySQL
- **Validation:** Joi
- **Password Hashing:** bcryptjs
- **Token:** JSON Web Token (JWT)

##  Project Structure
typescript-crud-api/
├── src/
│   ├── _helpers/
│   │   ├── db.ts
│   │   └── role.ts
│   ├── _middleware/
│   │   ├── errorHandler.ts
│   │   └── validateRequest.ts
│   ├── users/
│   │   ├── user.model.ts
│   │   ├── user.service.ts
│   │   └── users.controller.ts
│   └── server.ts
├── config.json
├── package.json
└── tsconfig.json
##  Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/typescript-crud-api.git
cd typescript-crud-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the database
Edit `config.json` with your MySQL credentials:
```json
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "your_password",
    "database": "typescript_crud_api"
  },
  "jwtSecret": "your_secret_key"
}
```

### 4. Run the server
```bash
npm run start:dev
```

Server runs on `http://localhost:4000`

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | Get all users |
| GET | /users/:id | Get user by ID |
| POST | /users | Create a new user |
| PUT | /users/:id | Update a user |
| DELETE | /users/:id | Delete a user |

##  Example Request

### Create User (POST /users)
```json
{
  "title": "Mr",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "confirmPassword": "secret123",
  "role": "User"
}
```

### Response
```json
{
  "message": "User created"
}
```

##  Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run start:dev` | Run with nodemon |
| Build | `npm run build` | Compile TypeScript |
| Start | `npm run start` | Run compiled JS |
>>>>>>> 151959f40d49d087b4f00462d27705431722ef55
