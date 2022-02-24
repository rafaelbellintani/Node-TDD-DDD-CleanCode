import { SignupController } from '../presentation/controllers/signup'
import { MissingParamsError } from '../presentation/errors/missing-params'

test('signup with bad username and expect 400 with param missing', () => {
  const sut = new SignupController()

  const httpRequest = {
    body: {
      email: 'any@example.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamsError('username'))
})
