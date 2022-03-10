const { Thought, User } = require('../models');

const thoughtController = {

    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find().then(thoughtData => {
            res.json(thoughtData)
        }).catch((err) => res.status(500).json(err))
    },

    // Get one thought by id
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
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
            .then(deletedThought => {
                if (!deletedThought) {
                    res.status(404).json({ message: 'No thought with that ID!' });
                    return;
                }
                return User.findOneAndUpdate(
                    { _id: req.params.username },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
            })
            .then((userData) => {
                res.json(userData);
            })
            .catch(err => res.json(err))
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

    // Delete reaction from thought
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
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


module.exports = thoughtController;
