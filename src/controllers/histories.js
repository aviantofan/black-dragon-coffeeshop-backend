const historyModel = require('../models/histories')
const showApi = require('../helpers/showResponse')
const validation = require('../helpers/validation')

exports.getHistories = async (request, response) => {
  let {
    name,
    page,
    limit,
    sort,
    order
  } = request.query
  name = name || ''
  sort = sort || 'h.created_at'
  const filledFilter = ['category_id', 'size_id', 'delivery_method_id', 'payment_method_id', 'delivery_time']
  const filter = {}
  page = ((page != null && page !== '') ? parseInt(page) : 1)
  limit = ((limit != null && limit !== '') ? parseInt(limit) : 10)
  order = order || 'desc'
  let pagination = {
    page,
    limit
  }
  let route = 'histories?'
  let searchParam = ''
  if (name) {
    searchParam = `name=${name}`
  }

  filledFilter.forEach((item) => {
    if (request.query[item]) {
      filter[item] = request.query[item]
      if (searchParam === '') {
        searchParam += `${item}=${filter[item]}`
      } else {
        searchParam += `&${item}=${filter[item]}`
      }
    }
  })
  route += searchParam

  const errValidation = await validation.validationPagination(pagination)
  if (errValidation == null) {
    const offset = (page - 1) * limit
    console.log(offset)
    const data = {
      name,
      filter,
      limit,
      offset,
      sort,
      order
    }
    const dataProduct = await historyModel.getDataHistoriesByFilter(data)

    if (dataProduct.length > 0) {
      const result = await historyModel.countDataHistoriesByFilter(data)
      try {
        const {
          total
        } = result[0]
        pagination = {
          ...pagination,
          total: total,
          route: route
        }
        return showApi.showResponseWithPagination(response, 'List Data Product', dataProduct, pagination)
      } catch (err) {
        return showApi.showResponse(response, err.message, null, 500)
      }
    } else {
      return showApi.showResponse(response, 'Data not found', null, 404)
    }
  } else {
    showApi.showResponse(response, 'Pagination was not valid.', null, validation.validationPagination(pagination), 400)
  }
}

exports.getHistoryById = async (request, response) => {
  try {
    const {
      id
    } = request.params

    if (!id) {
      return showApi.showResponse(response, 'Id is required', null, null, 400)
    }

    const data = await historyModel.getHistoryById(id)
    if (data.length > 0) {
      return showApi.showResponse(response, 'Data Product', data, null)
    } else {
      return showApi.showResponse(response, 'Data not found', null, 404)
    }
  } catch (error) {
    console.error(error);
    return showApi.showResponse(response, error.message, null, 500)
  }
}
