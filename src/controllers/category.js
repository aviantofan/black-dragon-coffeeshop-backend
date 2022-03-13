const categoryModel = require('../models/category');
const upload = require('../helpers/upload').single('image');
const showApi = require('../helpers/showResponse');
const validation = require('../helpers/validation');

const {
  APP_URL
} = process.env;

const insertCategory = (req, res) => {
  upload(req, res, async (errorUpload) => {
    const data = {
      name: req.body.name
    };
    let errValidation = await validation.validationDataCategory(data);

    if (req.file) {
      data.image = req.file.path;
    }
    if (errorUpload) {
      errValidation = {
        ...errValidation,
        image: errorUpload.message
      };
    }

    if (errValidation === null) {
      const dataCategory = {
        name: req.body.name
      };

      const registeredName = await categoryModel.getDataCategoryByName(dataCategory.name);

      if (registeredName.length > 0) {
        return showApi.showResponse(res, 'Category already registered', null, null, 400);
      }

      const resultDataCategory = await categoryModel.insertDataCategory(dataCategory);
      let success = false;
      if (resultDataCategory.affectedRows > 0) {
        success = true;
      }
      if (success) {
        const result = await categoryModel.getDataCategory(resultDataCategory.insertId);
        showApi.showResponse(res, 'Data category created successfully!', result[0]);
      } else {
        showApi.showResponse(res, 'Data category failed to create!', null, null, 500);
      }
    } else {
      showApi.showResponse(res, 'Data category not valid', null, errValidation, 400);
    }
  });
};

const getCategories = async (req, res) => {
  let {
    name,
    page,
    limit
  } = req.query;
  name = name || '';
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  let pagination = {
    page,
    limit
  };
  let route = 'categories?';
  let searchParam = '';
  if (name) {
    searchParam = `name=${name}`;
  }
  route += searchParam;

  const errValidation = await validation.validationPagination(pagination);
  if (errValidation === null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = {
      name,
      limit,
      offset
    };
    const dataCategory = await categoryModel.getDataCategories(data);

    if (dataCategory.length > 0) {
      const result = await categoryModel.countDataCategories(data);
      try {
        const {
          total
        } = result[0];
        pagination = {
          ...pagination,
          total: total,
          route: route
        };
        return showApi.showResponseWithPagination(res, 'List Data Category', dataCategory, pagination);
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

const getCategory = async (req, res) => {
  const {
    id
  } = req.params;
  const result = await categoryModel.getDataCategory(id);
  if (result.length > 0) {
    return showApi.showResponse(res, 'Detail category', result[0]);
  } else {
    return showApi.showResponse(res, 'Detail category not found!', null, 404);
  }
};

const updateCategory = (req, res) => {
  upload(req, res, async (errorUpload) => {
    const {
      id
    } = req.params;
    if (id) {
      if (!isNaN(id)) {
        const dataCategory = await categoryModel.getDataCategory(id);
        if (dataCategory.length > 0) {
          const dataCategory = {};
          const filled = ['name'];
          filled.forEach((value) => {
            if (req.body[value]) {
              if (req.file) {
                const photoTemp = req.file.path;
                dataCategory.image = photoTemp.replace('\\', '/');
              }
              dataCategory[value] = req.body[value];
            }
          });
          try {
            const update = await categoryModel.updateDataCategory(dataCategory, id);
            let detailCategory = false;
            if (update.affectedRows > 0) {
              detailCategory = true;
              if (detailCategory) {
                const result = await categoryModel.getDataCategory(id);
                if (result[0].image) {
                  result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
                }
                return showApi.showResponse(res, 'Data category updated successfully!', result[0]);
              } else {
                const result = await categoryModel.getDataCategory(id);
                if (result[0].image) {
                  result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
                }
                return showApi.showResponse(res, 'Data category updated successfully!', result[0]);
              }
            } else {
              return showApi.showResponse(res, 'Data category failed to update', null, null, 500);
            }
          } catch (err) {
            return showApi.showResponse(res, err.message, null, null, 500);
          }
        } else {
          return showApi.showResponse(res, 'Data category not found', null, null, 400);
        }
      } else {
        return showApi.showResponse(res, 'Id must be a number', null, null, 400);
      }
    } else {
      return showApi.showResponse(res, 'Id must be filled.', null, null, 400);
    }
  });
};

const deleteCategory = async (request, response) => {
  const {
    id
  } = request.params;

  const getDataCategory = await categoryModel.getDataCategory(id);
  let success = false;
  if (getDataCategory.length > 0) {
    success = true;
    if (success) {
      const resultDataCategory = await categoryModel.deleteDataCategory(id);
      if (resultDataCategory.affectedRows > 0) {
        // const result = await categoryModel.getDataCategory(id);
        showApi.showResponse(response, 'Data category deleted successfully!', getDataCategory[0]);
      } else {
        showApi.showResponse(response, 'Data category failed to delete!', null, 500);
      }
    }
  } else {
    showApi.showResponse(response, 'Data category not found!', null, 404);
  }
};

module.exports = {
  insertCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
};
