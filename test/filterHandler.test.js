'use strict'

const mockRepository = class {
  static filterBy () {
    return [
      { id: 2, username: 'joe_peterson', age: 1000 }
    ]
  }

  static sortBy() {

  }
}

const mockData = [
  { id: 1, username: 'joe', age: 1000 },
  { id: 2, username: 'joe_peterson', age: 1000 }
]

describe('FilterHandlerTest', () => {
  test('It filters the results based on employee_name query parameter', async () => {
    const FilterHander = require('../src/filterHandler')

    const mockRequest = {
      query: {
        employee_name: 'joe_peterson'
      },
      params: {}
    }

    jest.spyOn(mockRepository, 'filterBy')
      .mockReturnValue([
        { id: 2, username: 'joe_peterson', age: 1000 }
      ])

    const filterHandler = new FilterHander(mockRequest, mockRepository, mockData)

    expect(filterHandler.handleFilter().get()).toStrictEqual([
      { id: 2, username: 'joe_peterson', age: 1000 }
    ])

    expect(mockRepository.filterBy)
      .toHaveBeenCalledWith(mockData, 'employee_name', 'joe_peterson')
  })

  test('It does not filters the results when employee_name is not present in the request', async () => {
    const FilterHander = require('../src/filterHandler')

    const mockRequest = {
      query: {},
      params: {}
    }

    jest.spyOn(mockRepository, 'filterBy')
      .mockReturnValue([
        { id: 2, username: 'joe_peterson', age: 1000 }
      ])

    const filterHandler = new FilterHander(mockRequest, mockRepository, mockData)

    expect(filterHandler.handleFilter().get()).toStrictEqual(mockData)

    expect(mockRepository.filterBy)
      .not.toHaveBeenCalled()
  })

  test('It sorts the results based on sort and direction query params', async () => {
    const FilterHander = require('../src/filterHandler')

    const mockRequest = {
      query: {
        sort: 'employee_age',
        direction: 'ASC'
      },
      params: {}
    }

    jest.spyOn(mockRepository, 'filterBy')
      .mockReturnValue([
        { id: 2, username: 'joe_peterson', age: 1000 }
      ])

    jest.spyOn(mockRepository, 'sortBy')
      .mockReturnValue(mockData)

    const filterHandler = new FilterHander(mockRequest, mockRepository, mockData)

    expect(filterHandler.handleSort().get()).toStrictEqual(mockData)

    expect(mockRepository.filterBy)
      .not.toHaveBeenCalled()

    expect(mockRepository.sortBy)
      .toHaveBeenCalledWith(mockData, 'employee_age', 'ASC')
  })

  test('It does not sort the results if the query does not contains sort value', async () => {
    const FilterHander = require('../src/filterHandler')

    const mockRequest = {
      query: {
        direction: 'ASC'
      },
      params: {}
    }

    jest.spyOn(mockRepository, 'filterBy')
      .mockReturnValue([
        { id: 2, username: 'joe_peterson', age: 1000 }
      ])

    jest.spyOn(mockRepository, 'sortBy')
      .mockReturnValue(mockData)

    const filterHandler = new FilterHander(mockRequest, mockRepository, mockData)

    expect(filterHandler.handleSort().get()).toStrictEqual(mockData)

    expect(mockRepository.filterBy)
      .not.toHaveBeenCalled()

    expect(mockRepository.sortBy)
      .not.toHaveBeenCalledWith(mockData, 'employee_age', 'ASC')
  })

  test('It does not sort the results if the query does not contains direction value', async () => {
    const FilterHander = require('../src/filterHandler')

    const mockRequest = {
      query: {
        sort: 'employee_age'
      },
      params: {}
    }

    jest.spyOn(mockRepository, 'filterBy')
      .mockReturnValue([
        { id: 2, username: 'joe_peterson', age: 1000 }
      ])

    jest.spyOn(mockRepository, 'sortBy')
      .mockReturnValue(mockData)

    const filterHandler = new FilterHander(mockRequest, mockRepository, mockData)

    expect(filterHandler.handleSort().get()).toStrictEqual(mockData)

    expect(mockRepository.filterBy)
      .not.toHaveBeenCalled()

    expect(mockRepository.sortBy)
      .not.toHaveBeenCalledWith(mockData, 'employee_age', 'ASC')
  })

  test('It does not sort the results if the query does not contains direction and sort values', async () => {
    const FilterHander = require('../src/filterHandler')

    const mockRequest = {
      query: {},
      params: {}
    }

    jest.spyOn(mockRepository, 'filterBy')
      .mockReturnValue([
        { id: 2, username: 'joe_peterson', age: 1000 }
      ])

    jest.spyOn(mockRepository, 'sortBy')
      .mockReturnValue(mockData)

    const filterHandler = new FilterHander(mockRequest, mockRepository, mockData)

    expect(filterHandler.handleSort().get()).toStrictEqual(mockData)

    expect(mockRepository.filterBy)
      .not.toHaveBeenCalled()

    expect(mockRepository.sortBy)
      .not.toHaveBeenCalledWith(mockData, 'employee_age', 'ASC')
  })

  test('It can apply filter and sort when present in the query', async () => {
    const FilterHander = require('../src/filterHandler')

    const mockRequest = {
      query: {
        sort: 'employee_age',
        direction: 'DESC',
        employee_name: 'joe_peterson'
      },
      params: {}
    }

    jest.spyOn(mockRepository, 'filterBy')
      .mockReturnValue([
        { id: 2, username: 'joe_peterson', age: 1000 }
      ])

    jest.spyOn(mockRepository, 'sortBy')
      .mockReturnValue(mockData)

    const filterHandler = new FilterHander(mockRequest, mockRepository, mockData)

    expect(filterHandler.handleFilter().handleSort().get()).toStrictEqual(mockData)

    expect(mockRepository.filterBy)
      .toHaveBeenCalledWith(mockData, 'employee_name', 'joe_peterson')

    expect(mockRepository.sortBy)
      .not.toHaveBeenCalledWith(mockData, 'employee_age', 'DESC')
  })
})
