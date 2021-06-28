// external imports
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const checkLogin = (req, res, next) => {
    const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (!cookies) {
        if (res.locals.html) {
            return res.redirect('/');
        }

        return res.status(401).json({
            error: 'Authentication faild!',
        });
    }

    try {
        const token = cookies[process.env.COOKIE_NAME];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        // pass user info to response locals
        if (res.locals.html) {
            res.locals.loggedInUser = decoded;
        }

        return next();
    } catch (error) {
        if (res.locals.html) {
            return res.redirect('/');
        }

        return res.status(500).json({
            errors: {
                common: {
                    msg: 'Authentication faild!',
                },
            },
        });
    }
};

const redirectLoggedIn = (req, res, next) => {
    const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (!cookies) {
        next();
    } else {
        res.redirect('/inbox');
    }
};

const requireRole = (roles) => (req, res, next) => {
    if (req.user.role && roles.includes(req.user.role)) {
        next();
    } else if (res.locals.html) {
        next(createError(401, 'You are not authorized to access this page!'));
    } else {
        res.status(401).json({
            errors: {
                common: {
                    msg: 'You are not authorized!',
                },
            },
        });
    }
};

module.exports = { checkLogin, redirectLoggedIn, requireRole };
