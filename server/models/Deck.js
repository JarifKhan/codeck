const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => Math.random().toString(36).substring(2, 9),
  },
  title: {
    type: String,
    default: 'Slide',
  },
  content: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'javascript',
  },
});

const DeckSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'Untitled Deck',
    },
    pages: {
      type: [SlideSchema],
      default: () => [
        {
          id: 'slide-1',
          title: 'Slide 1',
          content: '// Welcome to Codeck!\nfunction helloWorld() {\n  console.log("Hello from Codeck");\n}\n\nhelloWorld();',
          language: 'javascript',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Deck', DeckSchema);
