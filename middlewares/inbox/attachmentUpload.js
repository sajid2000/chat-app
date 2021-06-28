const uploader = require('../../util/multipleUploader');

const attachmentUpload = (req, res, next) => {
    const upload = uploader(
        'attachments',
        ['images/jpg', 'images/jpeg', 'images/png'],
        1000000,
        2,
        'Only .jpg, .jpeg or .png format allowed!'
    );

    upload.any()(req, res, (err) => {
        if (!err) {
            return next();
        }

        return res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    });
};

module.exports = attachmentUpload;
