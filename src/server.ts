// src/server.ts
import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './_middleware/errorHandler';
import { initialize } from './_helpers/db';
import usersController from './users/users.controller';
<<<<<<< HEAD
import path from 'path';
=======
>>>>>>> 151959f40d49d087b4f00462d27705431722ef55

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
<<<<<<< HEAD
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/users', usersController);


app.use(errorHandler);


=======
app.use('/users', usersController);

// Global Error Handler (must be last)
app.use(errorHandler);

// Start server + initialize database
>>>>>>> 151959f40d49d087b4f00462d27705431722ef55
const PORT = process.env.PORT || 4000;

initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🔑 Test with: POST /users with { email, password, ... }`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });