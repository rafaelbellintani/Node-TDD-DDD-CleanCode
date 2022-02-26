export class ServerError extends Error {
  constructor () {
    super('Internal server error 500')
    this.name = 'Server Error 500'
  }
}
