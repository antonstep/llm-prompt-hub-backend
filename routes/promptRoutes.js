// promptRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const promptController = require('./controllers/promptController');
const authenticateToken = require('../middleware/auth');
const errorHandler = require('../middleware/errorHandler');
const requestLogger = require('../middleware/requestLogger');

// Logging middleware
router.use(requestLogger);

// Create a new prompt
router.post('/', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('content').notEmpty().withMessage('Content is required'),
], promptController.createPrompt);

// Get all prompts
router.get('/', promptController.getAllPrompts);

// Get a single prompt
router.get('/:id', promptController.getPromptById);

// Update a prompt
router.put('/:id', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('content').notEmpty().withMessage('Content is required'),
], promptController.updatePrompt);

// Delete a prompt
router.delete('/:id', authenticateToken, promptController.deletePrompt);

// Error handling middleware
router.use(errorHandler);

module.exports = router;

// controllers/promptController.js
const { Prompt, User } = require('../models');

// Create a new prompt
exports.createPrompt = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ status: 400, message: errors.array() });
  }

  const { title, description, content } = req.body;
  try {
    const prompt = await Prompt.create({
      title,
      description,
      content,
      userId: req.user.id,
    });
    res.status(201).json(prompt);
  } catch (error) {
    next(error);
  }
};

// Get all prompts
exports.getAllPrompts = async (req, res, next) => {
  try {
    const prompts = await Prompt.findAll({ include: User });
    res.json(prompts);
  } catch (error) {
    next(error);
  }
};

// Get a single prompt
exports.getPromptById = async (req, res, next) => {
  try {
    const prompt = await Prompt.findByPk(req.params.id, { include: User });
    if (!prompt) return next({ status: 404, message: 'Prompt not found' });
    res.json(prompt);
  } catch (error) {
    next(error);
  }
};

// Update a prompt
exports.updatePrompt = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ status: 400, message: errors.array() });
  }

  const { title, description, content } = req.body;
  try {
    const prompt = await Prompt.findByPk(req.params.id);
    if (!prompt || prompt.userId !== req.user.id) {
      return next({ status: 404, message: 'Prompt not found or unauthorized' });
    }
    prompt.title = title;
    prompt.description = description;
    prompt.content = content;
    await prompt.save();
    res.json(prompt);
  } catch (error) {
    next(error);
  }
};

// Delete a prompt
exports.deletePrompt = async (req, res, next) => {
  try {
    const prompt = await Prompt.findByPk(req.params.id);
    if (!prompt || prompt.userId !== req.user.id) {
      return next({ status: 404, message: 'Prompt not found or unauthorized' });
    }
    await prompt.destroy();
    res.json({ message: 'Prompt deleted' });
  } catch (error) {
    next(error);
  }
};

// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(err);
  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;

// middleware/requestLogger.js
const morgan = require('morgan');

const requestLogger = morgan('dev');

module.exports = requestLogger;