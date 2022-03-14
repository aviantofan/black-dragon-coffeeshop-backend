const promotionModel = require('../models/promotion');
const showApi = require('../helpers/showResponse');
// const upload = require('../helpers/upload').single('image')
// const auth = require('../helpers/auth')
const validation = require('../helpers/validation');
const validator = require('validator');

// const { APP_URL } = process.env

const getPromotions = async (request, response) => {
  let { name, page, limit, sort, order } = request.query;
  name = name || '';
  sort = sort || 'pr.created_at';
  const filledFilter = ['discount_value', 'delivery_method_id'];
  const filter = {};
  page = ((page != null && page !== '') ? parseInt(page) : 1);
  limit = ((limit != null && limit !== '') ? parseInt(limit) : 5);
  order = order || 'desc';
  let pagination = { page, limit };
  let route = 'promotions?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }

  filledFilter.forEach((item) => {
    if (request.query[item]) {
      filter[item] = request.query[item];
      if (searchParam === '') {
        searchParam += `${item}=${filter[item]}`;
      } else {
        searchParam += `&${item}=${filter[item]}`;
      }
    }
  });
  route += searchParam;

  const errValidation = await validation.validationPagination(pagination);
  if (errValidation == null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = { name, filter, limit, offset, sort, order };
    const dataPromo = await promotionModel.getDataPromotions(data);
    console.log(dataPromo);
    if (dataPromo.length > 0) {
      const result = await promotionModel.countDataPromotions(data);
      try {
        const { total } = result[0];
        pagination = { ...pagination, total: total, route: route };
        return showApi.showResponseWithPagination(response, 'List Data Promotions', dataPromo, pagination);
      } catch (err) {
        return showApi.showResponse(response, err.message, null, 500);
      }
    } else {
      return showApi.showResponse(response, 'Data not found', null, 404);
    }
  } else {
    showApi.showResponse(response, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
  }
};

const getPromotion = async (request, response) => {
  const { id } = request.params;

  const result = await promotionModel.getDataPromotion(id);
  if (result.length > 0) {
    return showApi.showResponse(response, 'Detail Promotion', result[0]);
  } else {
    return showApi.showResponse(response, 'Detail Promotion not found!', null, 404);
  }
};

const insertPromotion = async (request, response) => {
  try {
    const { name, code, description, normal_price, discount_value, available_start_at, available_end_at } = request.body;
    if (validator.isEmpty(name)) {
      return showApi.showResponse(response, 'Name must be filled!', null, null, 400);
    }
    if (validator.isEmpty(code)) {
      return showApi.showResponse(response, 'Code must be filled!', null, null, 400);
    }
    if (validator.isEmpty(description)) {
      return showApi.showResponse(response, 'Description must be filled!', null, null, 400);
    }
    if (validator.isEmpty(normal_price)) {
      return showApi.showResponse(response, 'Normal price must be filled!', null, null, 400);
    } else if (!validator.isNumeric(normal_price)) {
      return showApi.showResponse(response, 'Normal price must be a number!', null, null, 400);
    }

    if (validator.isEmpty(discount_value)) {
      return showApi.showResponse(response, 'Discount value must be filled!', null, null, 400);
    } else if (!validator.isNumeric(discount_value)) {
      return showApi.showResponse(response, 'Discount value must be a number!', null, null, 400);
    }

    if (validator.isEmpty(available_start_at)) {
      return showApi.showResponse(response, 'Available start at must be filled!', null, null, 400);
    } else if (!validator.isDate(available_start_at)) {
      return showApi.showResponse(response, 'Available start at must be a date!', null, null, 400);
    }

    if (validator.isEmpty(available_end_at)) {
      return showApi.showResponse(response, 'Available end at must be filled!', null, null, 400);
    } else if (!validator.isDate(available_end_at)) {
      return showApi.showResponse(response, 'Available end at must be a date!', null, null, 400);
    }

    const data = { name, code, description, normal_price, discount_value, available_start_at, available_end_at };
    if (request.file) {
      data.image = request.file.path;
    }

    const insert = await promotionModel.insertDataPromotion(data);
    if (insert.affectedRows > 0) {
      const result = await promotionModel.getDataPromotion(insert.insertId);
      return showApi.showResponse(response, 'Data Promotion created successfully!', showApi.dataMapping(result)[0]);
    } else {
      return showApi.showResponse(response, 'Data Promotion failed to create !');
    }
  } catch (error) {
    return showApi.showResponse(response, error.message, null, null, 500);
  }
};

const updatePromotion = async (request, response) => {
  try {
    console.log('masuk update');
    const { id } = request.params;
    if (!validator.isEmpty(id)) {
      if (validator.isNumeric(id)) {
        const getDataPromotion = await promotionModel.getDataPromotion(id);
        if (getDataPromotion.length > 0) {
          const filled = ['name', 'code', 'description', 'normal_price', 'discount_value', 'available_start_at', 'available_end_at'];
          const data = {};

          filled.forEach((value) => {
            if (request.body[value]) {
              if (value === 'normal_price' || value === 'discount_value') {
                if (!validator.isNumeric(request.body[value])) {
                  return showApi.showResponse(response, `${value} must be a number!`, null, null, 400);
                }
              }

              if (value === 'available_start_at' || value === 'available_end_at') {
                if (!validator.isDate(request.body[value])) {
                  return showApi.showResponse(response, `${value} must be date format!`, null, null, 400);
                }
              }
              if (request.file) {
                data.image = request.file.path;
              }
              data[value] = request.body[value];
            }
          });

          const update = await promotionModel.updateDataPromotion(data, id);
          if (update.affectedRows > 0) {
            const result = await promotionModel.getDataPromotion(id);
            return showApi.showResponse(response, 'Data Promotion created successfully!', showApi.dataMapping(result)[0]);
          } else {
            return showApi.showResponse(response, 'Data Promotion failed to update !', null, null, 400);
          }
        } else {
          return showApi.showResponse(response, 'Data not found!', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number!');
      }
    } else {
      return showApi.showResponse(response, 'Id must be filled!');
    }
  } catch (error) {
    return showApi.showResponse(response, error.message, null, null, 500);
  }
};

const deletePromotion = async (request, response) => {
  try {
    const { id } = request.params;

    if (!validator.isEmpty(id)) {
      if (validator.isNumeric(id)) {
        const getDataPromotion = await promotionModel.getDataPromotion(id);
        if (getDataPromotion.length > 0) {
          const result = await promotionModel.deleteDataPromotion(id);
          if (result.affectedRows > 0) {
            return showApi.showResponse(response, 'Data Promotion deleted successfully!', null, null, 200, true);
          } else {
            return showApi.showResponse(response, 'Data Promotion failed to delete !');
          }
        } else {
          return showApi.showResponse(response, 'Data not found!');
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number!');
      }
    } else {
      return showApi.showResponse(response, 'Id must be filled!');
    }
  } catch (error) {
    return showApi.showResponse(response, error.message, null, null, 500);
  }
};

module.exports = { getPromotions, getPromotion, insertPromotion, updatePromotion, deletePromotion };
