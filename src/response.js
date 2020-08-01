'use strict'

const HttpStatus = require('http-status-codes')
const { messages } = require('./constants')

class Response {
  static successData (data = null) {
    return {
      success: true,
      data
    }
  }

  static errorData (data = null) {
    return {
      error: true,
      data
    }
  }

  static async success(res, data) {
    res
      .status(HttpStatus.OK)
      .send(Response.successData(data))
  }

  static constructServerError(data) {
    return { errors: [{ param: 'server', msg: data, location: 'server' }] }
  }

  static async error(res, data, status = HttpStatus.INTERNAL_SERVER_ERROR) {
    res
      .status(status)
      .send(Response.errorData(data))
  }

  static async errorHandler (err, req, res) {
    return Response.serverError(res, err)
  }

  static async created(res, data) {
    res
      .status(HttpStatus.CREATED)
      .send(Response.successData(data))
  }

  static async serverError(res, err) {
    console.error('serverError', err)

    return Response.error(res, Response.constructServerError(messages.INTERNAL_SERVER_ERROR))
  }

  static async validationError(res, err) {
    console.error('vaidationError', err)

    return Response.error(res, err, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  static async notFoundError(res, err) {
    console.error('notFoundError', err)

    return Response.error(res, Response.constructServerError(messages.URL_NOT_FOUND), HttpStatus.NOT_FOUND)
  }
}

module.exports = Response
