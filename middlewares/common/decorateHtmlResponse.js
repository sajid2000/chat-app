function decorateHtmlResponse(pageTilte) {
    return function (req, res, next) {
        res.locals.html = true;
        res.locals.title = `${pageTilte} - ${process.env.APP_NAME}`;
        res.locals.loggedInUser = {};
        res.locals.errors = {};
        res.locals.data = {};
        next();
    };
}

module.exports = decorateHtmlResponse;
