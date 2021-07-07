const multer = require('multer');
const { temporaryAvatarsFolder } = require('../helpers/constants');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, temporaryAvatarsFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }
    cb(null, false);
  },
});

module.exports = {
  uploadAvatar,
};
