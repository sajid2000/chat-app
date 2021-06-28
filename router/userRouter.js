// external imports
const router = require('express').Router();

// internal imports
const { getUsers, addUser, removeUser } = require('../controller/userController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const { checkLogin, requireRole } = require('../middlewares/common/checkLogin');
const avatarUpload = require('../middlewares/users/avatarUpload');
const { addUserValidators, addUserValidationHandler } = require('../middlewares/users/userValidators');

// users page
router.get('/', decorateHtmlResponse('Users'), checkLogin, requireRole(['admin']), getUsers);

// add new user
router.post(
    '/',
    checkLogin,
    requireRole(['admin']),
    avatarUpload,
    addUserValidators,
    addUserValidationHandler,
    addUser
);

// delete user
router.delete('/:id', checkLogin, requireRole(['admin']), removeUser);

module.exports = router;
