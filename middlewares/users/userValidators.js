const path = require('path');
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');
const { unlink } = require('fs');
const User = require('../../models/People');

const addUserValidators = [
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name must not contain anything other than aplphabet')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw createError('Email already exists!');
                }
            } catch (error) {
                throw createError(error.message);
            }
        }),
    check('password')
        .isStrongPassword()
        .withMessage(
            'Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
        ),
    check('mobile')
        .isMobilePhone('bn-BD', { strictMode: true })
        .withMessage('Mobile number is must be a valid Bangladeshi mobile number')
        .custom(async (value) => {
            try {
                const user = await User.findOne({ mobile: value });
                if (user) {
                    throw createError('Mobile already is use');
                }
            } catch (error) {
                throw createError(error.message);
            }
        }),
];

const addUserValidationHandler = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length > 0) {
        // remove uploaded avatar file
        if (req.files.length > 0) {
            const { filename } = req.files[0];

            unlink(path.resolve(`public/uploads/avatars/${filename}`), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        res.status(404).json({
            errors: mappedErrors,
        });
    } else {
        next();
    }
};

module.exports = { addUserValidators, addUserValidationHandler };
