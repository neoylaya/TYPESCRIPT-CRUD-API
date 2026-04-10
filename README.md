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