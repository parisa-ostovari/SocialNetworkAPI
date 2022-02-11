const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormater = require('../utils/dateFormater');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required : 'Please leave a thought.',
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timeStamp => dateFormater(timeStamp)
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },

    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }

);

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;