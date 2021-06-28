// external imports
const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Conversation',
    mongoose.Schema(
        {
            creator: {
                id: mongoose.Types.ObjectId,
                name: String,
                avatar: String,
            },
            participant: {
                id: mongoose.Types.ObjectId,
                name: String,
                avatar: String,
            },
            last_updated: {
                type: Date,
                defautl: Date.now,
            },
        },
        { timestamps: true }
    )
);
