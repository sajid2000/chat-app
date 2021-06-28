// external imports
const path = require('path');
const fs = require('fs');

// internal imports
const uploader = require('../../util/uploader');

function avatarUpload(req, res, next) {
    if (!fs.existsSync(path.resolve('public/uploads/avatars'))) {
        fs.mkdirSync(path.resolve('public/uploads/avatars'));
    }

    const upload = uploader(
        'avatars',
        ['image/jpg', 'image/jpeg', 'image/png'],
        1000000,
        'Only .jpg, .jpeg or .png format allowed!'
    );

    upload.any()(req, res, (err) => {
        if (err) {
            res.status(500).json({
                errors: {
                    avatar: {
                        msg: err.message,
                    },
                },
            });
        } else {
            next();
        }
    });
}

module.exports = avatarUpload;
