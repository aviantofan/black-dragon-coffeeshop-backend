const cloudinary = require('cloudinary').v2;
const {
  CloudinaryStorage
} = require('multer-storage-cloudinary');
const multer = require('multer');
const {
  nanoid
} = require('nanoid');
const {
  showResponse
} = require('../helpers/showResponse');

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
      public_id: async (req, file) => nanoid(10)
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

const filFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;

  if (fileTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

exports.uploadMiddleware = (key, maxZize = null) => {
  const upload = multer({
    storage,
    fileFilter: filFilter,
    limits: {
      fileSize: maxZize || 2097152 // max 2MB
    }
  }).single(key);

  // return as upload middleware
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return showResponse(res, err.message, null, null, 400);
      }
      next();
    });
  };
};
