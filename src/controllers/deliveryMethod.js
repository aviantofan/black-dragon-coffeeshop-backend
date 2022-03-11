const deliveryMethodModel = require('../models/deliveryMethod');
const upload = require('../helpers/upload').single('image');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');

const { APP_URL } = process.env;

const insertDeliveryMethod = (req, res) => {
  upload(req, res, async (errorUpload) => {
    const data = {
      name: req.body.name
    };
    let errValidation = await validation.validationDataDeliveryMethod(data);

    if (req.file) {
      data.image = req.file.path;
    }
    if (errorUpload) {
      errValidation = { ...errValidation, image: errorUpload.message };
    }

    if (errValidation == null) {
      const dataDeliveryMethod = {
        name: req.body.name
      };
      const resultDataDeliveryMethod = await deliveryMethodModel.insertDataDeliveryMethod(dataDeliveryMethod);
      let success = false;
      if (resultDataDeliveryMethod.affectedRows > 0) {
        success = true;
      }
      if (success) {
        const result = await deliveryMethodModel.getDataDeliveryMethod(resultDataDeliveryMethod.insertId);
        showApi.showResponse(res, 'Data delivery method created successfully!', result);
      } else {
        showApi.showResponse(res, 'Data delivery method failed to create!', null, null, 500);
      }
    } else {
      showApi.showResponse(res, 'Data delivery method not valid', null, errValidation, 400);
    }
  });
};

const getDeliveryMethods = async (req, res) => {
  let { name, page, limit } = req.query;
  name = name || '';
  page = ((page != null && page !== '') ? parseInt(page) : 1);
  limit = ((limit != null && limit !== '') ? parseInt(limit) : 5);
  let pagination = { page, limit };
  let route = 'DeliveryMethods?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }
  route += searchParam;

  const errValidation = await validation.validationPagination(pagination);
  if (errValidation == null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = { name, limit, offset };
    const dataDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethods(data);

    if (dataDeliveryMethod.length > 0) {
      const result = await deliveryMethodModel.countDataDeliveryMethods(data);
      try {
        const { total } = result[0];
        pagination = { ...pagination, total: total, route: route };
        return showApi.showResponseWithPagination(res, 'List Data Delivery Method', dataDeliveryMethod, pagination);
      } catch (err) {
        return showApi.showResponse(res, err.message, null, 500);
      }
    } else {
      return showApi.showResponse(res, 'Data not found', null, 404);
    }
  } else {
    showApi.showResponse(res, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400);
  }
};

const getDeliveryMethod = async (req, res) => {
  const { id } = req.params;
  const result = await deliveryMethodModel.getDataDeliveryMethod(id);
  if (result.length > 0) {
    return showApi.showResponse(res, 'Detail delivery method', result[0]);
  } else {
    return showApi.showResponse(res, 'Detail delivery method not found!', null, 404);
  }
};

const updateDeliveryMethod = (req, res) => {
  upload(req, res, async (errorUpload) => {
    const { id } = req.params;
    if (id) {
      if (!isNaN(id)) {
        const dataDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(id);
        if (dataDeliveryMethod.length > 0) {
          const dataDeliveryMethod = {};
          const filled = ['name'];
          filled.forEach((value) => {
            if (req.body[value]) {
              if (req.file) {
                const photoTemp = req.file.path;
                dataDeliveryMethod.image = photoTemp.replace('\\', '/');
              }
              dataDeliveryMethod[value] = req.body[value];
            }
          });
          try {
            const update = await deliveryMethodModel.updateDataDeliveryMethod(dataDeliveryMethod, id);
            let detailDeliveryMethod = false;
            if (update.affectedRows > 0) {
              detailDeliveryMethod = true;
              if (detailDeliveryMethod) {
                const result = await deliveryMethodModel.getDataDeliveryMethod(id);
                result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
                return showApi.showResponse(res, 'Data delivery method updated successfully!', result[0]);
              } else {
                const result = await deliveryMethodModel.getDataDeliveryMethod(id);
                result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
                return showApi.showResponse(res, 'Data delivery method updated successfully!', result[0]);
              }
            } else {
              return showApi.showResponse(res, 'Data delivery method failed to update', null, null, 500);
            }
          } catch (err) {
            return showApi.showResponse(res, err.message, null, null, 500);
          }
        } else {
          return showApi.showResponse(res, 'Data delivery method not found', null, null, 400);
        }
      } else {
        return showApi.showResponse(res, 'Id must be a number', null, null, 400);
      }
    } else {
      return showApi.showResponse(res, 'Id must be filled.', null, null, 400);
    }
  });
};

const deleteDeliveryMethod = async (request, response) => {
  const { id } = request.params;

  const getDataDeliveryMethod = await deliveryMethodModel.getDataDeliveryMethod(id);
  let success = false;
  if (getDataDeliveryMethod.length > 0) {
    success = true;
    if (success) {
      const resultDataDeliveryMethod = await deliveryMethodModel.deleteDataDeliveryMethod(id);
      if (resultDataDeliveryMethod.affectedRows > 0) {
        const result = await deliveryMethodModel.getDataDeliveryMethod(id);
        showApi.showResponse(response, 'Data delivery method deleted successfully!', result);
      } else {
        showApi.showResponse(response, 'Data delivery method failed to delete!', null, 500);
      }
    }
  } else {
    showApi.showResponse(response, 'Data delivery method not found!', null, 404);
  }
};

module.exports = { insertDeliveryMethod, getDeliveryMethods, getDeliveryMethod, updateDeliveryMethod, deleteDeliveryMethod };
