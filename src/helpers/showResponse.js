const {
  APP_URL
} = process.env

exports.showResponse = (res, message, result, error = null, status = 200) => {
  console.log(error)
  let success = true
  const data = {
    success,
    message
  }
  if (status >= 400) {
    success = false
    data.error = error
  }

  if (result) {
    data.result = result
  }
  return res.status(status).json(data)
}

exports.showResponseWithPagination = (res, message, result, pagination, status = 200) => {
  let success = true
  if (status >= 400) {
    success = false
  }
  const data = {
    success,
    message
  }
  if (result) {
    data.result = result
    data.pagination = getPagination(pagination)
  }
  return res.status(status).json(data)
}

const getPagination = (pagination) => {
  console.log(pagination)
  const last = Math.ceil(pagination.total / pagination.limit)
  const url = `${APP_URL}/${pagination.route}&page=`
  return {
    prev: pagination.page > 1 ? `${url}${pagination.page - 1}` : null,
    next: pagination.page < last ? `${url}${pagination.page + 1}` : null,
    totalData: pagination.total,
    currentPage: pagination.page,
    lastPage: last
  }
}
