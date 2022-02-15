const { Schema, Types } = require('mongoose')
const dateFormater = require('../utils/dateFormater');

// Reaction schema is a Sub Document for the Thought.js model
const reactionSchema = new Schema (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: timeStamp => dateFormater(timeStamp)
        }
    },

    {
        toJSON: {
            getters: true
        },
        id: false
    }

);

module.exports = reactionSchema;