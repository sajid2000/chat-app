const multer = require('multer');
const createError = require('http-errors');
const path = require('path');

function uploader(subfolderPath, allowedFileTypes, maxFileSize, errorMsg) {
    const UPLOADS_FOLDER = path.resolve(`public/uploads/${subfolderPath}`);

    const storage = multer.diskStorage({
        destination: (req, res, cb) => {
            cb(null, UPLOADS_FOLDER);
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName = `${file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-')}-${Date.now()}`;

            cb(false, fileName + fileExt);
        },
    });

    const upload = multer({
        storage,
        limits: {
            fileSize: maxFileSize,
        },
        fileFilter: (req, file, cb) => {
            if (allowedFileTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(errorMsg));
            }
        },
    });

    return upload;
}

module.exports = uploader;
