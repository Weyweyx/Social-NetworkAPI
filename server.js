const express = require('express'); // Import Express.js for server functionality
const db = require('./config/connection'); // MongoDB connection
const routes = require('./routes'); // API routes

// Initialize the Express application
const app = express();

// Define the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Middleware to parse incoming JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the routes defined in the /routes directory
app.use(routes);

// Start the server once the database connection is established
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

// Error handling for database connection issues
db.on('error', (err) => {
  console.error('Database connection error:', err);
});