// extarnal imports
const router = require('express').Router();
// internal imports
const { login, logout, getLogin } = require('../controller/loginController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const { checkLogin, redirectLoggedIn } = require('../middlewares/common/checkLogin');
const { loginValidators, loginValidationHandler } = require('../middlewares/login/loginValidators');

// login page
router.get('/', decorateHtmlResponse('Login'), redirectLoggedIn, getLogin);
// process login
router.post('/', decorateHtmlResponse('Login'), redirectLoggedIn, loginValidators, loginValidationHandler, login);
// process logout
router.post('/logout', checkLogin, logout);

module.exports = router;
