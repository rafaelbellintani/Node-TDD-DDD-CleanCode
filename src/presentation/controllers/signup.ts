import { MissingParamsError } from '../errors/missing-params'
import { HttpRequest, HttpResponse } from '../protocols/http'
import { Controller } from '../protocols/controller'

export class SignupController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const fields = ['username', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      if (!httpRequest.body[field]) {
        return ({
          statusCode: 400,
          body: new MissingParamsError(field)
        })
      }
    }
    throw new Error('none')
  }
}
