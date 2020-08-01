'use strict'

class FilterHandler {
  constructor (req, repository, data) {
    this.req = req
    this.repository = repository
    this.data = data
  }

  handleFilter () {
    if (this.req.query.employee_name) {
      this.data = this.repository.filterBy(this.data, 'employee_name', this.req.query.employee_name)
    }

    return this
  }

  handleSort() {
    if (this.req.query.sort && this.req.query.direction) {
      this.data = this.repository.sortBy(this.data, this.req.query.sort, this.req.query.direction)
    }

    return this
  }

  get() {
    return this.data
  }

  mutateToStrings() {
    this.data = this.data.map(employee => {
      Object.keys(employee).forEach(k => {
        employee[k] = employee[k].toString()
      })

      return employee
    })

    return this
  }
}

module.exports = FilterHandler
