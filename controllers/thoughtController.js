const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single thought by ID
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        thought
          ? res.json(thought)
          : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        // Add the thought's ID to the associated user's `thoughts` array
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        user
          ? res.json({ message: 'Thought created and associated with user!' })
          : res.status(404).json({ message: 'Thought created, but no user found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought by ID
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {
      new: true,
      runValidators: true,
    })
      .then((thought) =>
        thought
          ? res.json(thought)
          : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought by ID
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        thought
          ? User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
          : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .then((user) =>
        user
          ? res.json({ message: 'Thought and associated reference deleted!' })
          : res.status(404).json({ message: 'Thought deleted, but no associated user found' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((thought) =>
        thought
          ? res.json(thought)
          : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a reaction by reactionId
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((thought) =>
        thought
          ? res.json(thought)
          : res.status(404).json({ message: 'No thought found with this ID' })
      )
      .catch((err) => res.status(500).json(err));
  },
};