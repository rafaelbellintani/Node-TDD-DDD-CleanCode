import { SignupController } from '../presentation/controllers/signup'
import { MissingParamsError } from '../presentation/errors/missing-params'
import { EmailValidator } from '../presentation/protocols/email-validator'
import { InvalidParamsError } from '../presentation/errors/invalid-params'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignupController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

test('signup with bad username and expect 400 with param missing', () => {
  const { sut } = makeSut()
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
  const { sut } = makeSut()

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
  const { sut } = makeSut()

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
  const { sut } = makeSut()

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

test('signup with bad email and expect 400 with param missing', () => {
  const { sut, emailValidatorStub } = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

  const httpRequest = {
    body: {
      username: 'any',
      email: 'any@example.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }

  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
})
