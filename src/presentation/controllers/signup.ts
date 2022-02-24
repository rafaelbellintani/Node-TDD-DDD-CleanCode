import { MissingParamsError } from '../errors/missing-params'

export class SignupController {
  handle (httpRequest: any): any {
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
