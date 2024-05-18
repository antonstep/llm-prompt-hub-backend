const express = require('express');
const { Prompt, User } = require('../models');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Create a new prompt
router.post('/', authenticateToken, async (req, res) => {
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
    res.status(400).json({ error: error.message });
  }
});

// Get all prompts
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.findAll({ include: User });
    res.json(prompts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single prompt
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findByPk(req.params.id, { include: User });
    if (!prompt) return res.status(404).json({ error: 'Prompt not found' });
    res.json(prompt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a prompt
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, content } = req.body;
  try {
    const prompt = await Prompt.findByPk(req.params.id);
    if (!prompt || prompt.userId !== req.user.id) {
      return res.status(404).json({ error: 'Prompt not found or unauthorized' });
    }
    prompt.title = title;
    prompt.description = description;
    prompt.content = content;
    await prompt.save();
    res.json(prompt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a prompt
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const prompt = await Prompt.findByPk(req.params.id);
    if (!prompt || prompt.userId !== req.user.id) {
      return res.status(404).json({ error: 'Prompt not found or unauthorized' });
    }
    await prompt.destroy();
    res.json({ message: 'Prompt deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
