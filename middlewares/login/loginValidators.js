// extarnal imports
const { check, validationResult } = require('express-validator');

const loginValidators = [
    check('username').isLength({ min: 1 }).withMessage('Mobile number or email is required.'),
    check('password').isLength({ min: 1 }).withMessage('Password is required.'),
];

const loginValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length > 0) {
        res.render('index', {
            data: {
                username: req.body.username,
            },
            errors: mappedErrors,
        });
    } else {
        next();
    }
};

module.exports = { loginValidators, loginValidationHandler };
