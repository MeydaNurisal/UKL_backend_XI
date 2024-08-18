const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extname = path.extname(file.originalname);
        cb(null, `cover-${timestamp}${extname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const acceptedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (!acceptedTypes.includes(file.mimetype)) {
            cb(null, false);
            return cb(new Error(`Invalid file type (${file.mimetype})`));
        }
        const fileSize = req.headers['content-length'];
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (fileSize > maxSize) {
            cb(null, false);
            return cb(new Error('File size is too large'));
        }
        cb(null, true);
    }
});

module.exports = upload;
