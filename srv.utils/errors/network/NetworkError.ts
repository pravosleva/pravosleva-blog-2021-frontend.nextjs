import { UniversalError } from '~/srv.utils/errors'

export class NetworkError extends UniversalError {
  constructor(message?: string) {
    super('NetworkError')
    this.message = message || 'No message'

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NetworkError.prototype)
  }

  getErrorMsg(): string {
    const msgs = [this.getReadableCamelCase(this.name)]

    if (!!this.message) msgs.push(this.message)

    return msgs.join(' • ')
  }
}
