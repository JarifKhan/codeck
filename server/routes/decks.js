const express = require('express');
const mongoose = require('mongoose');
const Deck = require('../models/Deck');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Ensure MongoDB Atlas is connected
router.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        'MongoDB Atlas is not connected yet. Please whitelist your IP address in MongoDB Atlas (Security -> Network Access -> Add IP -> Allow Access from Anywhere 0.0.0.0/0).',
    });
  }
  next();
});

// All deck routes require authentication
router.use(authMiddleware);

// GET /api/decks - Get all decks for logged-in user
router.get('/', async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user.id }).sort({ updatedAt: -1 });
    return res.json({ decks });
  } catch (error) {
    console.error('Fetch decks error:', error);
    return res.status(500).json({ message: 'Error fetching decks', error: error.message });
  }
});

// GET /api/decks/:id - Get a specific deck
router.get('/:id', async (req, res) => {
  try {
    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found.' });
    }
    return res.json({ deck });
  } catch (error) {
    console.error('Fetch deck error:', error);
    return res.status(500).json({ message: 'Error fetching deck', error: error.message });
  }
});

// POST /api/decks - Create a new deck
router.post('/', async (req, res) => {
  try {
    const { title, pages } = req.body;

    const newDeck = new Deck({
      user: req.user.id,
      title: title?.trim() || 'Untitled Deck',
      pages: pages && pages.length > 0 ? pages : undefined,
    });

    const savedDeck = await newDeck.save();
    return res.status(201).json({ message: 'Deck saved successfully!', deck: savedDeck });
  } catch (error) {
    console.error('Create deck error:', error);
    return res.status(500).json({ message: 'Error creating deck', error: error.message });
  }
});

// PUT /api/decks/:id - Update an existing deck
router.put('/:id', async (req, res) => {
  try {
    const { title, pages } = req.body;

    const updatedDeck = await Deck.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        ...(title !== undefined && { title: title.trim() || 'Untitled Deck' }),
        ...(pages !== undefined && { pages }),
      },
      { new: true }
    );

    if (!updatedDeck) {
      return res.status(404).json({ message: 'Deck not found.' });
    }

    return res.json({ message: 'Deck updated successfully!', deck: updatedDeck });
  } catch (error) {
    console.error('Update deck error:', error);
    return res.status(500).json({ message: 'Error updating deck', error: error.message });
  }
});

// DELETE /api/decks/:id - Delete a deck
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Deck.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Deck not found.' });
    }
    return res.json({ message: 'Deck deleted successfully!' });
  } catch (error) {
    console.error('Delete deck error:', error);
    return res.status(500).json({ message: 'Error deleting deck', error: error.message });
  }
});

module.exports = router;
