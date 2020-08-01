
const mockData = [
  { id: 1, employee_name: 'joe', username: 'joe', age: 1000 },
  { id: 2, employee_name: 'joe_peterson', username: 'joe_peterson', age: 1000 }
]

jest.mock('../src/db', () => ({
  counter: 3,
  records: mockData
}))

const employeeRepository = require('../src/repositories/employeeRepository')

describe('EmployeeRepositoryTest', () => {
  test('findAll returns a clone of all records in the database', async () => {
    expect(employeeRepository.findAll()).toStrictEqual(mockData)
  })

  test('findById returns a single record by Id', async () => {
    expect(employeeRepository.findById(2))
      .toStrictEqual({ id: 2, username: 'joe_peterson', employee_name: 'joe_peterson', age: 1000 })
  })

  test('findById returns null when the Id is not found', async () => {
    expect(employeeRepository.findById(1000)).toStrictEqual(null)
  })

  test('filterBy filters records by certain value', async () => {
    const records = employeeRepository.findAll()
    expect(employeeRepository.filterBy(records, 'username', 'joe_peterson'))
      .toStrictEqual([{ id: 2, employee_name: 'joe_peterson', username: 'joe_peterson', age: 1000 }])
  })

  test('filterBy filters records with fuzzy search when the property is employee_name', async () => {
    const records = employeeRepository.findAll()
    expect(employeeRepository.filterBy(records, 'employee_name', 'joe'))
      .toStrictEqual(mockData)
  })
})
