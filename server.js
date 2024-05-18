const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Simple route for testing
app.get('/', (req, res) => {
  res.send('LLM Prompt Hub API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Step 3: Set Up Models
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Set to true for logging SQL queries
});

module.exports = sequelize;

//Step 3: Initialize Sequelize
const sequelize = require('./config/database');

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database', err));

//Step 4: Use Routes
const userRoutes = require('./routes/userRoutes');

app.use('/api/users', userRoutes);

//Use dotenv in Your Application
require('dotenv').config();

