const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Messages',
    mongoose.Schema(
        {
            text: {
                type: String,
            },
            attachment: [{ type: String }],
            sender: {
                id: mongoose.Types.ObjectId,
                name: String,
                avatar: String,
            },
            receiver: {
                id: mongoose.Types.ObjectId,
                name: String,
                avatar: String,
            },
            date_time: {
                type: Date,
                default: Date.now,
            },
            conversation_id: {
                type: mongoose.Types.ObjectId,
                required: true,
            },
        },
        { timestamps: true }
    )
);
