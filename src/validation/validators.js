'use strict'

const { isEmployeeExisting } = require('./validationHelpers')
const { param, body, query } = require('express-validator')

const existingEmployeeValidator = [
  param('id')
    .isInt()
    .bail()
    .custom(isEmployeeExisting)
]

const createEmployeeValidator = [
  body('employee_name')
    .trim()
    .isString()
    .not().isEmpty(),

  body('employee_salary')
    .isInt({ min: 1 }),

  body('employee_age')
    .isInt({ min: 1 }),

  body('profile_image')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
]

const listEmployeeValidator = [
  query('employee_name')
    .optional()
    .trim()
    .isString(),
  query('sort')
    .optional()
    .isIn(['id', 'employee_name', 'employee_age', 'employee_salary']),
  query('direction')
    .optional()
    .isIn(['ASC', 'DESC'])
]

module.exports = {
  createEmployeeValidator,
  listEmployeeValidator,
  existingEmployeeValidator
}
