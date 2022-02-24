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

test('signup with bad email and expect 400 with param missing', () => {
  const sut = new SignupController()

  const httpRequest = {
    body: {
      username: 'any',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }

  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamsError('email'))
})

test('signup with bad password and expect 400 with param missing', () => {
  const sut = new SignupController()

  const httpRequest = {
    body: {
      username: 'any',
      email: 'any@example.com',
      passwordConfirmation: 'any_password'
    }
  }

  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamsError('password'))
})

test('signup with bad passwordConfirmation and expect 400 with param missing', () => {
  const sut = new SignupController()

  const httpRequest = {
    body: {
      username: 'any',
      email: 'any@example.com',
      password: 'any_password'
    }
  }

  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingParamsError('passwordConfirmation'))
})
