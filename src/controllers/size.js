const sizeModel = require('../models/size');
const upload = require('../helpers/upload').single('image');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');

const { APP_URL } = process.env;

const insertSize = (req, res) => {
  upload(req, res, async (errorUpload) => {
    const data = {
      name: req.body.name
    };
    let errValidation = await validation.validationDataSize(data);

    if (req.file) {
      data.image = req.file.path;
    }
    if (errorUpload) {
      errValidation = { ...errValidation, image: errorUpload.message };
    }

    if (errValidation == null) {
      const dataSize = {
        name: req.body.name
      };
      const resultDataSize = await sizeModel.insertDataSize(dataSize);
      let success = false;
      if (resultDataSize.affectedRows > 0) {
        success = true;
      }
      if (success) {
        const result = await sizeModel.getDataSize(resultDataSize.insertId);
        showApi.showResponse(res, 'Data size created successfully!', result);
      } else {
        showApi.showResponse(res, 'Data size failed to create!', null, null, 500);
      }
    } else {
      showApi.showResponse(res, 'Data size not valid', null, errValidation, 400);
    }
  });
};

const getSizes = async (req, res) => {
  let { name, page, limit } = req.query;
  name = name || '';
  page = ((page != null && page !== '') ? parseInt(page) : 1);
  limit = ((limit != null && limit !== '') ? parseInt(limit) : 5);
  let pagination = { page, limit };
  let route = 'sizes?';
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
    const dataSize = await sizeModel.getDataSize(data);

    if (dataSize.length > 0) {
      const result = await sizeModel.countDataSize(data);
      try {
        const { total } = result[0];
        pagination = { ...pagination, total: total, route: route };
        return showApi.showResponseWithPagination(res, 'List Data size', dataSize, pagination);
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

const getSize = async (req, res) => {
  const { id } = req.params;
  const result = await sizeModel.getDataSize(id);
  if (result.length > 0) {
    return showApi.showResponse(res, 'Detail size', result[0]);
  } else {
    return showApi.showResponse(res, 'Detail size not found!', null, 404);
  }
};

const updateSize = (req, res) => {
  upload(req, res, async (errorUpload) => {
    const { id } = req.params;
    if (id) {
      if (!isNaN(id)) {
        const dataSize = await sizeModel.getDataSize(id);
        if (dataSize.length > 0) {
          const dataSize = {};
          const filled = ['name'];
          filled.forEach((value) => {
            if (req.body[value]) {
              if (req.file) {
                const photoTemp = req.file.path;
                dataSize.image = photoTemp.replace('\\', '/');
              }
              dataSize[value] = req.body[value];
            }
          });
          try {
            const update = await sizeModel.updateDataSize(dataSize, id);
            let detailSize = false;
            if (update.affectedRows > 0) {
              detailSize = true;
              if (detailSize) {
                const result = await sizeModel.getDataSize(id);
                result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
                return showApi.showResponse(res, 'Data size updated successfully!', result[0]);
              } else {
                const result = await sizeModel.getDataSize(id);
                result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
                return showApi.showResponse(res, 'Data Size updated successfully!', result[0]);
              }
            } else {
              return showApi.showResponse(res, 'Data size failed to update', null, null, 500);
            }
          } catch (err) {
            return showApi.showResponse(res, err.message, null, null, 500);
          }
        } else {
          return showApi.showResponse(res, 'Data size not found', null, null, 400);
        }
      } else {
        return showApi.showResponse(res, 'Id must be a number', null, null, 400);
      }
    } else {
      return showApi.showResponse(res, 'Id must be filled.', null, null, 400);
    }
  });
};

const deleteSize = async (request, response) => {
  const { id } = request.params;

  const getDataSize = await sizeModel.getDataSize(id);
  let success = false;
  if (getDataSize.length > 0) {
    success = true;
    if (success) {
      const resultDataSize = await sizeModel.deleteDataSize(id);
      if (resultDataSize.affectedRows > 0) {
        const result = await sizeModel.getDataSize(id);
        showApi.showResponse(response, 'Data size deleted successfully!', result);
      } else {
        showApi.showResponse(response, 'Data size failed to delete!', null, 500);
      }
    }
  } else {
    showApi.showResponse(response, 'Data size not found!', null, 404);
  }
};

module.exports = { insertSize, getSizes, getSize, updateSize, deleteSize };
