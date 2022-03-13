const fs = require('fs');

exports.deleteFile = (path) => {
  if (path) {
    fs.rm(path, err => {
      if (err) console.error(err);
    });
  }
};
