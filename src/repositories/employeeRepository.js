'use strict'

const db = require('../db')
const clone = require('clone')

class EmployeeRepository {
  static findAll() {
    return clone(db.records)
  }

  static findById (id) {
    const result = db.records.filter(employee => id === employee.id)

    return result.length ? clone(result[0]) : null
  }

  static updateEmployee (id, employee) {
    const resultIndex = db.records.findIndex(dbEmployee => dbEmployee.id === id)
    if (resultIndex === -1) {
      return null
    }

    db.records[resultIndex] = { ...db.records[resultIndex], ...employee }

    return db.records[resultIndex]
  }

  static createEmployee (employee) {
    employee.id = db.counter++
    db.records.push(employee)

    return employee
  }

  static deleteEmployee(id) {
    return (db.records = db.records.filter(employee => id !== employee.id))
  }

  static compareStrings(string1, string2) {
    return string1.localeCompare(string2)
  }

  static compareDigits(digit1, digit2) {
    return digit1 - digit2
  }

  static compare(property1, property2) {
    if (typeof property1 === 'string' || property1 instanceof String) {
      return EmployeeRepository.compareStrings(property1, property2)
    }

    return EmployeeRepository.compareDigits(property1, property2)
  }

  static sortBy(records, property, direction) {
    return [...records].sort((employee1, employee2) => {
      if (direction === 'ASC') {
        return EmployeeRepository.compare(employee1[property], employee2[property])
      }

      return EmployeeRepository.compare(employee2[property], employee1[property])
    })
  }

  static filterBy(records, property, value) {
    if (property === 'employee_name') {
      return records.filter(employee => employee.employee_name
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase()))
    }

    return records.filter(employee => employee[property] === value)
  }
}

module.exports = EmployeeRepository
