require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
  origin: 'https://antonstep.github.io/llm-prompt-hub-frontend/'
}));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('LLM Prompt Hub API');
});

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Set to true for logging SQL queries
});

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Error syncing database', err));

// Use Routes
const userRoutes = require('./routes/userRoutes');
const promptRoutes = require('./routes/promptRoutes');

app.use('/api/users', userRoutes);
app.use('/api/prompts', promptRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});