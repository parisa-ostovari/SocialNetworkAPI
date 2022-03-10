const { User, Thought } = require('../models');

const userController = {
    // Create a new user
    createUser(req, res) {
        User.create(req.body).then((user) => {
            res.json(user)
        }).catch((err) => res.status(500).json(err))
    },
    // Get all users
    getAllUsers(req, res) {
        User.find().select('-__v').then((user) => {
            res.json(user)
        }).catch((err) => res.status(500).json(err))
    },
    // Get one user 
    getOneUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this id' })
                    return;
                }
                res.json(user)
            })
            .catch((err) => res.status(500).json(err));
    },
    // Create new user
    createUser(req, res) {
        User.create(req.body)
            .then((newUser) => res.json(newUser))
            .catch((err) => res.status(500).json(err));
    },
    // Update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((updatedUser) => {
                if (!updatedUser) {
                    res.status(404).json({ message: 'No user with this id' })
                    return;
                }
                res.json(updatedUser)
            })
            .catch((err) => res.status(500).json(err));
    },
    // Delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this id' })
                    return;
                }
                res.status(200).json({ message: `User with id: ${req.params.userId} has been deleted` })
            })
            .catch((err) => res.status(500).json(err));
    },
    // Add friend to friends list
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            { runValidators: true, new: true }
        )
            .then((friend) => {
                if (!friend) {
                    res.status(400).json({ message: 'No user with this id' })
                    return;
                }
                res.status(201).json(friend)
            })
            .catch((err) => res.status(500).json(err));
    },

    // Remove friend from friends list
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((friend) => {
                if (!friend) {
                    res.status(400).json({ message: 'No user with this id' })
                    return;
                }
                res.status(200).json(friend)
            })
            .catch((err) => res.status(500).json(err));
    }
};

module.exports = userController;