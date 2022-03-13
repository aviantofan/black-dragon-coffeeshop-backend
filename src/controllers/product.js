const productModel = require('../models/product');
const showApi = require('../helpers/showResponse');
const upload = require('../helpers/upload').single('image');
// const auth = require('../helpers/auth');
const validation = require('../helpers/validation');

const {
  APP_URL
} = process.env;

const getFilterData = async (request, response) => {
  let {
    name,
    page,
    limit,
    sort,
    order
  } = request.query;
  name = name || '';
  sort = sort || 'p.created_at';
  const filledFilter = ['size_id', 'delivery_method_id'];
  const filter = {};
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  order = order || 'desc';
  let pagination = {
    page,
    limit
  };
  let route = 'products?';
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
  if (errValidation === null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = {
      name,
      filter,
      limit,
      offset,
      sort,
      order
    };
    const dataFilter = await productModel.getFilter(data);

    if (dataFilter.length > 0) {
      const result = await productModel.countFilter(data);
      try {
        const {
          total
        } = result[0];
        pagination = {
          ...pagination,
          total: total,
          route: route
        };
        return showApi.showResponseWithPagination(response, 'List Data Product', dataFilter, pagination);
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

const getProducts = async (request, response) => {
  let {
    name,
    page,
    limit,
    sort,
    order
  } = request.query;
  name = name || '';
  sort = sort || 'p.created_at';
  const filledFilter = ['category_id'];
  const filter = {};
  page = ((page !== null && page !== '') ? parseInt(page) : 1);
  limit = ((limit !== null && limit !== '') ? parseInt(limit) : 5);
  order = order || 'desc';
  let pagination = {
    page,
    limit
  };
  let route = 'products?';
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
  if (errValidation === null) {
    const offset = (page - 1) * limit;
    console.log(offset);
    const data = {
      name,
      filter,
      limit,
      offset,
      sort,
      order
    };
    const dataProduct = await productModel.getDataProducts(data);

    if (dataProduct.length > 0) {
      const result = await productModel.countDataProducts(data);
      try {
        const {
          total
        } = result[0];
        pagination = {
          ...pagination,
          total: total,
          route: route
        };
        return showApi.showResponseWithPagination(response, 'List Data Product', dataProduct, pagination);
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

const getProduct = async (request, response) => {
  const {
    id
  } = request.params;

  const result = await productModel.getDataProduct(id);
  if (result.length > 0) {
    return showApi.showResponse(response, 'Detail Product', result[0]);
  } else {
    return showApi.showResponse(response, 'Detail Product not found!', null, 404);
  }
};

const insertProduct = async (request, response) => {
  upload(request, response, async (errorUpload) => {
    // auth.verifyUser(request, response, async (error) => {
    const data = {
      name: request.body.name,
      price: request.body.price,
      description: request.body.description,
      stocks: request.body.stocks,
      delivery_time_start: request.body.deliveryTimeStart,
      delivery_time_end: request.body.deliveryTimeEnd,
      category_id: request.body.categoryId
    };

    let errValidation = await validation.validationDataProducts(data);
    // let errValidation = validation.validationDataProducts(data);

    if (request.file) {
      data.image = request.file.path;
    }
    if (errorUpload) {
      errValidation = {
        ...errValidation,
        image: errorUpload.message
      };
    }

    if (errValidation === null) {
      const dataProduct = {
        name: request.body.name,
        price: request.body.price,
        description: request.body.description,
        stocks: request.body.stocks,
        delivery_time_start: request.body.deliveryTimeStart,
        delivery_time_end: request.body.deliveryTimeEnd,
        category_id: request.body.categoryId
      };
      // const resultDataProduct = await productModel.insertDataProduct(dataProduct);
      const resultDataProduct = await productModel.insertDataProduct(dataProduct);
      let success = false;
      if (resultDataProduct.affectedRows > 0) {
        success = true;
      }
      if (success) {
        const result = await productModel.getDataProduct(resultDataProduct.insertId);
        showApi.showResponse(response, 'Data product created successfully!', result[0]);
      } else {
        showApi.showResponse(response, 'Data product failed to create!', null, null, 500);
      }
    } else {
      showApi.showResponse(response, 'Data product not valid', null, errValidation, 400);
    }
  });
};

const updateProduct = (request, response) => {
  upload(request, response, async (errorUpload) => {
    // auth.verifyUser(request, response, async(error) => {
    const {
      id
    } = request.params;

    if (id) {
      if (!isNaN(id)) {
        const dataProduct = await productModel.getDataProduct(id);
        if (dataProduct.length > 0) {
          const data = {
            name: request.body.name,
            price: request.body.price,
            description: request.body.description,
            stocks: request.body.stocks,
            delivery_time_start: request.body.deliveryTimeStart,
            delivery_time_end: request.body.deliveryTimeEnd,
            category_id: request.body.categoryId
          };
          let errValidation = await validation.validationDataProducts(data);

          if (request.file) {
            data.image = request.file.path;
          }
          if (errorUpload) {
            errValidation = {
              ...errValidation,
              photo: errorUpload.message
            };
          }

          if (errValidation === null) {
            const resultDataProduct = await productModel.updateDataProduct(data, id);
            console.log(resultDataProduct);
            let success = false;
            if (resultDataProduct.affectedRows > 0) {
              success = true;
            }
            if (success) {
              const result = await productModel.getDataProduct(id);
              showApi.showResponse(response, 'Data product updated successfully!', result);
            } else {
              showApi.showResponse(response, 'Data product failed to update!', 500);
            }
          } else {
            showApi.showResponse(response, 'Data product not valid', null, errValidation, 400);
          }
        } else {
          return showApi.showResponse(response, 'Data product not found', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
  });
};

const updatePatchProduct = (request, response) => {
  upload(request, response, async (errorUpload) => {
    // auth.verifyUser(request, response, async(error) => {
    const {
      id
    } = request.params;
    if (id) {
      if (!isNaN(id)) {
        const getDataProduct = await productModel.getDataProduct(id);
        if (getDataProduct.length > 0) {
          const dataProduct = {};

          const filled = ['name', 'price', 'description', 'stocks', 'delivery_time_start', 'delivery_time_end', 'category_id'
          ];
          filled.forEach((value) => {
            if (request.body[value]) {
              if (value !== 'size_id' && value !== 'delivery_method_id') {
                if (request.file) {
                  const photoTemp = request.file.path;
                  dataProduct.image = photoTemp.replace('\\', '/');
                }
                dataProduct[value] = request.body[value];
              }
            }
          });

          try {
            const update = await productModel.updateDataProduct(dataProduct, id);
            let detailProduct = false;
            if (update.affectedRows > 0) {
              detailProduct = true;
            }
            if (detailProduct) {
              const result = await productModel.getDataProduct(id);
              result[0].image = `${APP_URL}/${result[0].image.replace('\\', '/')}`;
              return showApi.showResponse(response, 'Data product updated successfully!', result[0]);
            } else {
              return showApi.showResponse(response, 'Data product failed to update', null, null, 500);
            }
          } catch (err) {
            return showApi.showResponse(response, err.message, null, null, 500);
          }
        } else {
          return showApi.showResponse(response, 'Data product not found', null, null, 400);
        }
      } else {
        return showApi.showResponse(response, 'Id must be a number', null, null, 400);
      }
    } else {
      return showApi.showResponse(response, 'Id must be filled.', null, null, 400);
    }
  });
};

const deleteProduct = async (request, response) => {
  // auth.verifyUser(request, response, async(error) => {
  const {
    id
  } = request.params;

  const getDataProduct = await productModel.getDataProduct(id);
  let success = false;
  if (getDataProduct.length > 0) {
    success = true;
  }
  if (success) {
    const resultDataProduct = await productModel.deleteDataProduct(id);
    if (resultDataProduct.affectedRows > 0) {
      const result = await productModel.getDataProduct(id);
      showApi.showResponse(response, 'Data product deleted successfully!', result[0]);
    } else {
      showApi.showResponse(response, 'Data product failed to delete!', null, 500);
    }
  } else {
    showApi.showResponse(response, 'Data product not found!', null, 404);
  }
};

module.exports = {
  getProducts,
  getProduct,
  insertProduct,
  updateProduct,
  updatePatchProduct,
  deleteProduct,
  getFilterData
};
