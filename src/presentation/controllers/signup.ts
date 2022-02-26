import { MissingParamsError } from '../errors/missing-params'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamsError } from '../errors/invalid-params'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const fields = ['username', 'email', 'password', 'passwordConfirmation']
      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamsError('email'))
      }
      return ({
        statusCode: 200,
        body: 'Ok'
      })
    } catch (error) {
      return serverError()
    }
  }
}
