import { MissingParamsError, InvalidParamsError } from '../../errors'
import { EmailValidator, Controller, HttpRequest, HttpResponse, AddAccount } from './signup-protocols'
import { badRequest, serverError } from '../../helpers/http-helper'

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const fields = ['username', 'email', 'password', 'passwordConfirmation']
      for (const field of fields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }
      const { username, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamsError('passwordConfirmationError'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamsError('email'))
      }
      this.addAccount.add({
        username,
        email,
        password
      })
      return ({
        statusCode: 200,
        body: 'Ok'
      })
    } catch (error) {
      return serverError()
    }
  }
}
