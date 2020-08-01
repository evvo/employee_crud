'use strict'

const { messages } = require('../constants')
const { validationResult } = require('express-validator')
const Response = require('../response')
const employeeRepository = require('../repositories/employeeRepository')

const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    return Response.validationError(res, { errors: errors.array() })
  }
}

function isEmployeeExisting(id) {
  const result = employeeRepository.findById(id)

  if (!result) {
    return Promise.reject(new Error(messages.URL_NOT_FOUND))
  }

  return true
}

module.exports = {
  validate,
  isEmployeeExisting
}
