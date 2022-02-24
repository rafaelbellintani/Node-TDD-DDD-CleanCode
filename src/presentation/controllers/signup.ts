import { MissingParamsError } from '../errors/missing-params'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignupController {
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
