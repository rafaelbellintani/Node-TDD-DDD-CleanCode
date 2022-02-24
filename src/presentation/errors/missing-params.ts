export class MissingParamsError extends Error {
  constructor (paramName: string) {
    super(`Missing parms: ${paramName}`)
    this.name = 'MissingParamsError'
  }
}
