const multer = require('multer');
const createError = require('http-errors');
const path = require('path');

const multipleUploader = (subfolderPath, allowedFileTypes, maxFileSize, maxNumberOfFiles, errorMsg) => {
    const UPLOADS_FOLDER = path.resolve(`public/uploads/${subfolderPath}`);

    const upload = multer({
        storage: multer.diskStorage({
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

                cb(null, fileName + fileExt);
            },
        }),
        limits: {
            fileSize: maxFileSize,
        },
        fileFilter: (req, file, cb) => {
            if (req.files.length > maxNumberOfFiles) {
                cb(createError(`Maximum ${maxNumberOfFiles} files are allowed to upload`));
            } else if (allowedFileTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(errorMsg));
            }
        },
    });

    return upload;
};

module.exports = multipleUploader;
