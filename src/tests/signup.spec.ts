import { SignupController } from '../presentation/controllers/signup'
import { MissingParamsError, InvalidParamsError, ServerError } from '../presentation/errors'
import { EmailValidator } from '../presentation/protocols'
import { AccountModel } from '../domain/models/account'
import { AddAccount, AddAccountModel } from '../domain/usecases/add-account'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        username: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignupController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
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

test('Should return 400 if password is not equal passwordConfirmation', () => {
  const { sut } = makeSut()

  const httpRequest = {
    body: {
      username: 'any',
      email: 'any@example.com',
      password: 'invalid_password',
      passwordConfirmation: 'any_password'
    }
  }

  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidParamsError('passwordConfirmationError'))
})

test('Should pass with correct email account', () => {
  const { sut, emailValidatorStub } = makeSut()
  const emailSpyOn = jest.spyOn(emailValidatorStub, 'isValid')

  const httpRequest = {
    body: {
      username: 'any',
      email: 'any@example.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }

  sut.handle(httpRequest)
  expect(emailSpyOn).toHaveBeenCalledWith('any@example.com')
})

test('emailvalidator return error and expect 500 status code', () => {
  const { sut, emailValidatorStub } = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
    throw new Error()
  })

  const httpRequest = {
    body: {
      username: 'any',
      email: 'any@example.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }

  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new ServerError())
})

test('Should call AddAccount with correct values', () => {
  const { sut, addAccountStub } = makeSut()
  const addSpy = jest.spyOn(addAccountStub, 'add')

  const httpRequest = {
    body: {
      username: 'any',
      email: 'any@example.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }

  sut.handle(httpRequest)
  expect(addSpy).toHaveBeenCalledWith({
    username: 'any',
    email: 'any@example.com',
    password: 'any_password'
  })
})
