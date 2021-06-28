const createError = require('http-errors');

// 404 not found handler
function notFoundHandler(req, res, next) {
    next(createError(404, 'Your requested content was not found!'));
}

// default error handler
function errorHandler(err, req, res, next) {
    try {
        const error = process.env.NODE_ENV === 'development' ? err : { message: err.message };

        res.status(err.status || 500);

        if (res.locals.html) {
            // html response
            res.render('error', {
                title: 'Error Page',
                error,
            });
        } else {
            // json response
            res.json(error);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    notFoundHandler,
    errorHandler,
};
