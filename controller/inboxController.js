// external imports
const createError = require('http-errors');
// internal imports
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const People = require('../models/People');
const escape = require('../util/escape');

const getInbox = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            $or: [{ 'creator.id': req.user.userId }, { 'participant.id': req.user.userId }],
        });

        res.locals.conversations = conversations;
        res.render('inbox');
    } catch (error) {
        next(error);
    }
};

const searchUser = async (req, res, next) => {
    const { user } = req.body;
    const searchQuery = user.replace('+88', '');
    const nameSearchRegex = new RegExp(escape(searchQuery), 'i');
    const mobileSearchRegex = new RegExp(`^${escape(`+88${searchQuery}`)}`);
    const emailSearchRegex = new RegExp(`^${escape(`${searchQuery}$`, 'i')}`);

    try {
        if (searchQuery !== '') {
            const users = await People.find(
                {
                    $or: [{ name: nameSearchRegex }, { email: emailSearchRegex }, { mobile: mobileSearchRegex }],
                },
                'name avatar'
            );

            res.status(200).json(users);
        } else {
            throw createError('You must provide some text to search!');
        }
    } catch (error) {
        next(error);
    }
};

const addConversation = async (req, res) => {
    try {
        const newConversation = new Conversation({
            creator: {
                id: req.user.userId,
                name: req.user.username,
                avatar: req.user.avatar,
            },
            participant: {
                id: req.body.participant_id,
                name: req.body.participant,
                avatar: req.body.participant_avatar,
            },
        });

        await newConversation.save();

        res.status(200).json({
            message: 'Conversation was created successfully!',
        });
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
};

const deleteConversations = async (req, res) => {
    const { conversation_id: conversationId } = req.params;

    try {
        await Conversation.findByIdAndDelete(conversationId);

        await Message.deleteMany({ conversation_id: conversationId });

        res.status(200).json({
            message: 'Conversation was deleted successfully!',
        });
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
};

const getMessage = async (req, res) => {
    // eslint-disable-next-line camelcase
    const { conversation_id } = req.params;
    try {
        const messages = await Message.find({ conversation_id }).sort('-createdAt');

        const { participant } = await Conversation.findById(conversation_id);

        res.status(200).json({
            data: {
                messages,
                participant,
            },
            user: req.user.userId,
            conversation_id,
        });
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
};
// send new message
const sendMessage = async (req, res) => {
    if (req.body.message || (req.files && req.files.length > 0)) {
        try {
            let attachments = null;

            if (req.files && req.files.length > 0) {
                attachments = [];

                req.files.forEach((file) => attachments.push(file.filename));
            }

            const { message, conversationId, receiverId, receiverName, receiverAvatar = null } = req.body;
            const { userId: senderId, username: senderName, avatar: senderAvatar = null } = req.user;

            const newMessage = new Message({
                text: message,
                attachment: attachments,
                sender: {
                    id: senderId,
                    name: senderName,
                    avatar: senderAvatar,
                },
                receiver: {
                    id: receiverId,
                    name: receiverName,
                    avatar: receiverAvatar,
                },
                conversation_id: conversationId,
            });

            const result = await newMessage.save();

            // emit socket event
            global.io.emit('new_message', {
                message: {
                    conversation_id: conversationId,
                    sender: {
                        id: senderId,
                        name: senderName,
                        avatar: senderAvatar,
                    },
                    message,
                    attachment: attachments,
                    date_time: result.date_time,
                },
            });

            res.status(200).json({ message: 'Message sent successfully!', data: result });
        } catch (error) {
            res.status(500).json({
                errors: {
                    common: {
                        msg: error.message,
                    },
                },
            });
        }
    } else {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Message text or attachment is required!',
                },
            },
        });
    }
};

module.exports = { getInbox, searchUser, addConversation, deleteConversations, getMessage, sendMessage };
