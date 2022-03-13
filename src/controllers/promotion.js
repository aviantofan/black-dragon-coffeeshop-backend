const promotionModel = require('../models/promotion');
const showApi = require('../helpers/showResponse');
// const upload = require('../helpers/upload').single('image')
// const auth = require('../helpers/auth')
const validation = require('../helpers/validation');

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
module.exports = { getPromotions, getPromotion };
