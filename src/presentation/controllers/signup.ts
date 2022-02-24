export class SignupController {
  handle (httpRequest: any): any {
    const fields = ['username', 'email', 'password', 'passwordConfirmation']
    for (const field of fields) {
      if (!httpRequest.body[field]) {
        return ({
          statusCode: 400,
          body: new Error(`Missing param: ${field}`)
        })
      }
    }
    throw new Error('none')
  }
}
