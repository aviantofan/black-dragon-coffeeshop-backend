const promotionDeliveryMethodModel = require('../models/promotionDeliveryMethod')
const showApi = require('../helpers/showResponse')
const validation = require('../helpers/validation')

const insertPromotionDeliveryMethod = async (request, response) => {
  const data = {
    promotion_id: parseInt(request.body.promotion_id),
    delivery_method_id: parseInt(request.body.delivery_method_id)
  }

  const errValidation = await validation.validationDataPromotionDeliveryMethods(data)

  if (errValidation == null) {
    const dataPromotionDeliveryMethod = {
      promotion_id: parseInt(request.body.promotion_id),
      delivery_method_id: parseInt(request.body.delivery_method_id)
    }

    const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.insertDataPromotionDeliveryMethod(dataPromotionDeliveryMethod)
    let success = false
    if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
      success = true
    }
    if (success) {
      const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(resultDataPromotionDeliveryMethod.insertId)
      showApi.showResponse(response, 'Data promotion delivery method created successfully!', result[0])
    } else {
      showApi.showResponse(response, 'Data promotion delivery method failed to create!', null, null, 500)
    }
  } else {
    showApi.showResponse(response, 'Data promotion delivery method not valid', null, errValidation, 400)
  }
}

const getPromotionDeliveryMethods = async (request, response) => {
  let { name, page, limit, sort, order } = request.query
  name = name || ''
  sort = sort || 'pdm.created_at'
  const filledFilter = ['delivery_method_id']
  const filter = {}
  page = ((page != null && page !== '') ? parseInt(page) : 1)
  limit = ((limit != null && limit !== '') ? parseInt(limit) : 5)
  order = order || 'desc'
  let pagination = { page, limit }
  let route = 'promotionDeliveryMethods?'
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
    const data = { name, filter, limit, offset, sort, order }
    const dataPromotionDeliveryMethods = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethods(data)

    if (dataPromotionDeliveryMethods.length > 0) {
      const result = await promotionDeliveryMethodModel.countDataPromotionDeliveryMethods(data)
      try {
        const { total } = result[0]
        pagination = { ...pagination, total: total, route: route }
        return showApi.showResponseWithPagination(response, 'List Data Promotion Delivery Method', dataPromotionDeliveryMethods, pagination)
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

const getPromotionDeliveryMethod = async (request, response) => {
  const { id } = request.params

  const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id)
  if (result.length > 0) {
    return showApi.showResponse(response, 'Detail Promotion Delivery Method', result[0])
  } else {
    return showApi.showResponse(response, 'Detail Promotion Delivery Method not found!', null, 404)
  }
}

const updatePromotionDeliveryMethod = async (request, response) => {
  const { id } = request.params

  if (id) {
    if (!isNaN(id)) {
      const dataPromotionDeliveryMethod = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id)
      if (dataPromotionDeliveryMethod.length > 0) {
        const data = {
          name: request.body.name,
          price: request.body.price,
          description: request.body.description,
          stocks: request.body.stocks,
          delivery_time_start: request.body.deliveryTimeStart,
          delivery_time_end: request.body.deliveryTimeEnd,
          category_id: request.body.categoryId,
          delivery_method_id: request.body.deliveryMethodId,
          size_id: request.body.sizeId
        }

        const errValidation = await validation.validationDataPromotionDeliveryMethods(data)

        if (errValidation == null) {
          const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.updateDataPromotionDeliveryMethod(dataPromotionDeliveryMethod, id)
          let success = false
          if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
            success = true
          }
          if (success) {
            const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id)
            showApi.showResponse(response, 'Data promotion delivery method updated successfully!', result)
          } else {
            showApi.showResponse(response, 'Data promotion delivery method failed to update!', 500)
          }
        } else {
          showApi.showResponse(response, 'Data promotion delivery method not valid', null, errValidation, 400)
        }
      } else {
        return showApi.showResponse(response, 'Data promotion delivery method not found', null, null, 400)
      }
    } else {
      return showApi.showResponse(response, 'Id must be a number', null, null, 400)
    }
  } else {
    return showApi.showResponse(response, 'Id must be filled.', null, null, 400)
  }
}

const deletePromotionDeliveryMethod = async (request, response) => {
  // auth.verifyUser(request, response, async(error) => {
  const { id } = request.params

  const getDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id)
  if (getDataPromotionDeliveryMethod.length > 0) {
    let success = false

    const resultDataPromotionDeliveryMethodDeliveryMethod = await promotionDeliveryMethodModel.deleteDataPromotionDeliveryMethodDeliveryMethod(id)
    if (resultDataPromotionDeliveryMethodDeliveryMethod.affectedRows > 0) {
      success = true
    }
    if (success) {
      const resultDataPromotionDeliveryMethod = await promotionDeliveryMethodModel.deleteDataPromotionDeliveryMethod(id)
      if (resultDataPromotionDeliveryMethod.affectedRows > 0) {
        const result = await promotionDeliveryMethodModel.getDataPromotionDeliveryMethod(id)
        showApi.showResponse(response, 'Data promotion delivery method deleted successfully!', result)
      } else {
        showApi.showResponse(response, 'Data promotion delivery method failed to delete!', null, 500)
      }
    }
  } else {
    showApi.showResponse(response, 'Data promotion delivery method not found!', null, 404)
  }
}

module.exports = { insertPromotionDeliveryMethod, getPromotionDeliveryMethods, getPromotionDeliveryMethod, updatePromotionDeliveryMethod, deletePromotionDeliveryMethod }
