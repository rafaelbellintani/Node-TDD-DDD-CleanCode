import { MissingParamsError, InvalidParamsError } from '../errors'
import { EmailValidator, Controller, HttpRequest, HttpResponse } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helper'

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
      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamsError('passwordConfirmationError'))
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
