const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.substring(3);
    console.log(extension);
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const typeImage = [
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (!typeImage.includes(file.mimetype)) {
    cb(new Error('Type image must be .jpg/.png/.gif'), false);
  } else {
    cb(null, true);
  }
};
const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 2000000
  }
});

module.exports = upload;
