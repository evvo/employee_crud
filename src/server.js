const express = require('express')
const cors = require('cors')
const employeeRepository = require('./repositories/employeeRepository')
const { validate } = require('./validation/validationHelpers')
const { listEmployeeValidator, createEmployeeValidator, existingEmployeeValidator } = require('./validation/validators')
const Response = require('./response')
const FilterHandler = require('./filterHandler')

const app = express()
const port = process.env.API_PORT || 8080

app.use(express.json())
app.use(cors())
app.options('*', cors())
app.disable('x-powered-by')
const apiPath = '/api'

// Default data in the memory storage
const initialData = [
  { employee_name: 'Nick Peterson', employee_age: 23, employee_salary: 234000, profile_image: '' },
  { employee_name: 'Jane Jackson', employee_age: 32, employee_salary: 341000, profile_image: '' },
  { employee_name: 'Zack Logan', employee_age: 44, employee_salary: 155000, profile_image: '' }
]

initialData.forEach(employee => employeeRepository.createEmployee(employee))

function extractParams (body) {
  // eslint-disable-next-line camelcase
  const { employee_name, employee_age, employee_salary, profile_image } = body
  return { employee_name, employee_age, employee_salary, profile_image }
}

const inputNormalizer = function (req, res, next) {
  if (!req.body.profile_image) {
    req.body.profile_image = ''
  }

  next()
}

const idNormalizer = function (req, res, next) {
  req.params.id = parseInt(req.params.id)

  next()
}

app.get(`${apiPath}/employee`, validate(listEmployeeValidator), async (req, res) => {
  const filterResults = (new FilterHandler(req, employeeRepository, employeeRepository.findAll()))
    .handleFilter()
    .handleSort()
    // string values for all properties
    // .mutateToStrings()
    .get()

  return Response.success(res, filterResults)
})

app.get(`${apiPath}/employee/:id`, idNormalizer, async (req, res) => {
  const result = employeeRepository.findById(req.params.id)

  if (!result) {
    return Response.notFoundError(res, result)
  }

  return Response.success(res, result)
})

app.put(`${apiPath}/employee/:id`,
  idNormalizer,
  validate(existingEmployeeValidator),
  validate(createEmployeeValidator),
  inputNormalizer,
  async (req, res) => {
    const result = employeeRepository.updateEmployee(req.params.id, extractParams(req.body))

    return Response.success(res, result)
  })

app.delete(`${apiPath}/employee/:id`,
  idNormalizer,
  validate(existingEmployeeValidator),
  async (req, res) => {
    const result = employeeRepository.deleteEmployee(req.params.id)

    return Response.success(res, result)
  })

app.post(`${apiPath}/employee`,
  validate(createEmployeeValidator),
  inputNormalizer,
  async (req, res) => {
    const result = employeeRepository.createEmployee(extractParams(req.body))

    return Response.created(res, result)
  })

app.all('*',
  (req, res) => {
    return Response.notFoundError(res, { path: req.path, method: req.method })
  })

// If you run the application behind proxy, you will need this
app.enable('trust proxy')

app.use(Response.errorHandler)
app.listen(port, () => console.log(`Properties app listening at http://localhost:${port}`))
