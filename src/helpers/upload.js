const cloudinary = require('cloudinary').v2;
const {
  CloudinaryStorage
} = require('multer-storage-cloudinary');
const {
  nanoid
} = require('nanoid');
const multer = require('multer');

const {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  ENVIRONMENT
} = process.env;

let storage;

if (ENVIRONMENT === 'production') {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
    secure: true
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'black-dragon/uploads',
      format: async (req, file) => 'jpg',
      public_id: async (req, file) => {
        const currentDate = Date.now();
        const fileName = String(nanoid(10)) + '-' + currentDate;
        return fileName;
      }
    }
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const extension = file.originalname.split('.').pop();
      const fileName = nanoid() + file.originalname + '.' + extension;
      cb(null, fileName);
    }
  });
}

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
    fileSize: 2097152 // 2MB
  }
});

module.exports = upload;
