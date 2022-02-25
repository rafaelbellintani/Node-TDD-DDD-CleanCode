export class InvalidParamsError extends Error {
  constructor (paramName: string) {
    super(`Invalid parms: ${paramName}`)
    this.name = 'InvalidParamsError'
  }
}
