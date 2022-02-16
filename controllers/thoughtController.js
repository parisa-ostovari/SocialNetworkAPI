const { Thought, User } = require('../models');

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    // Get one thought by id
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) => {
                !thought
                    ? res.status(404).json({ message: 'No thought found with that id' })
                    : res.json(thought)
            })
            .catch((err) => {
                res.status(500).json(err)
            });
    },

    // Create a thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { username: req.body.username },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "No username with this id found." })
                }
                res.json({ message: "Thought created." })
            })
            .catch((err) => res.status(500).json(err));
    },

    // Update thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) => {
                !thought
                    ? res.status(404).json({ message: 'No thought with this id.' })
                    : res.json(thought)
            })
            .catch((err) => res.status(500).json(err));
    },

    // Delete thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) => {
                if (!thought) {
                    return res.status(404).json({ message: 'No thought with this id.' })
                }
                res.json({ message: 'Thought deleted.' })
            })
            .catch((err) => res.status(500).json(err));
    },

    // Add reaction to thought
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id.' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Remove reaction from thought
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with this id.' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

};

