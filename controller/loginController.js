// extarnal imports
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
// internal imports
const User = require('../models/People');

const getLogin = (req, res) => {
    res.render('index');
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: username }, { phone: username }],
        });

        if (!user || !user._id) {
            throw createError('Login faild! Please try again.');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw createError('Login faild! Please try again.');
        }

        const userObj = {
            userId: user._id,
            username: user.name,
            mobile: user.mobile,
            email: user.email,
            role: user.role,
        };
        // generate jwt token
        const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
            maxAge: process.env.JWT_EXPIRY,
            httpOnly: true,
            signed: true,
        });

        // set logged in user local identifier
        res.locals.loggedInUser = userObj;

        res.redirect('inbox');
    } catch (error) {
        res.render('index', {
            errors: {
                common: {
                    msg: error.message,
                },
            },
        });
    }
};

const logout = (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.send('logged out');
};

module.exports = { getLogin, login, logout };
