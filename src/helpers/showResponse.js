// const querystring = require('querystring');
const {
  deleteFile
} = require('../helpers/fileHandler');
const {
  APP_URL,
  ENVIRONMENT
} = process.env;

exports.showResponse = (res, message, result, error = null, status = 200, deleteImage = false) => {
  // console.error(error);
  let success = true;
  const data = {
    success,
    message
  };
  if (status >= 400) {
    success = false;

    if (deleteImage) {
      deleteFile(deleteImage);
    }
    // data.error = error;
  }

  if (result) {
    data.result = result;
  }
  return res.status(status).json(data);
};

exports.showResponseWithPagination = (res, message, result, pagination, status = 200) => {
  let success = true;
  if (status >= 400) {
    success = false;
  }
  const data = {
    success,
    message
  };
  if (result) {
    data.result = result;
    data.pagination = getPagination(pagination);
  }
  return res.status(status).json(data);
};

const getPagination = (pagination) => {
  console.log(pagination);
  const last = Math.ceil(pagination.total / pagination.limit);
  const url = `http://${APP_URL}/${pagination.route}&page=`;
  return {
    prev: pagination.page > 1 ? `${url}${pagination.page - 1}` : null,
    next: pagination.page < last ? `${url}${pagination.page + 1}` : null,
    totalData: pagination.total,
    currentPage: pagination.page,
    lastPage: last
  };
};

exports.returningError = (res, status, message, deletePath = false) => {
  if (deletePath) {
    // deleteFile(deletePath);
  }
  return res.status(status).json({
    success: false,
    message
  });
};

exports.returningSuccess = (res, status, message, data, pageInfo = null) => {
  if (pageInfo) {
    return res.status(status).json({
      success: true,
      message: message,
      pageInfo,
      results: data
    });
  }

  return res.status(status).json({
    success: true,
    message: message,
    results: data
  });
};

// use querystring for pagination
exports.pageInfoCreator = (totalDataCount, url, values) => {
  const {
    page,
    limit
  } = values;

  const keys = [];
  let next = url;
  let prev = url;

  for (const key in values) {
    keys.push(key);
  }

  keys.forEach((el, idx) => {
    if (values[el]) {
      if (el === 'page') {
        next += el + '=' + (Number(values[el]) + 1) + '&';
        prev += el + '=' + (Number(values[el]) - 1) + '&';
      } else if (idx < (keys.length - 1)) {
        next += el + '=' + values[el] + '&';
        prev += el + '=' + values[el] + '&';
      } else {
        next += el + '=' + values[el];
        prev += el + '=' + values[el];
      }
    }
  });

  const totalData = totalDataCount;

  const totalPages = Math.ceil(totalData / limit) || 1;

  return ({
    totalData,
    totalPages,
    currentPage: page,
    nextPage: page < totalPages ? next : null,
    prevPage: page > 1 ? prev : null,
    lastPages: totalPages
  });
};

exports.dataMapping = (data) => {
  data.map(el => {
    if (el.image !== null) {
      const path = el.image.replace(/\\/g, '/');
      if (ENVIRONMENT !== 'production') {
        el.image = `${APP_URL}/${path}`;
      }
    } else {
      el.image = null;
    }
    return el;
  });

  return data;
};
