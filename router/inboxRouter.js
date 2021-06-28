// external imports
const router = require('express').Router();
// internal imports
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const { checkLogin } = require('../middlewares/common/checkLogin');
const attachmentUpload = require('../middlewares/inbox/attachmentUpload');
const {
    getInbox,
    searchUser,
    addConversation,
    deleteConversations,
    getMessage,
    sendMessage,
} = require('../controller/inboxController');

// Inbox page
router.get('/', decorateHtmlResponse('Inbox'), checkLogin, getInbox);
// search user for conversation
router.post('/search', checkLogin, searchUser);
// add conversation
router.post('/conversation', checkLogin, addConversation);
// delete conversation
router.delete('/conversation/:conversation_id', checkLogin, deleteConversations);
// get message
router.get('/messages/:conversation_id', checkLogin, getMessage);
// send message
router.post('/message', checkLogin, attachmentUpload, sendMessage);

module.exports = router;
