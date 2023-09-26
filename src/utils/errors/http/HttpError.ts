import { UniversalError } from '~/utils/errors'

export class HttpError extends UniversalError {
  constructor(public status: number, public message: string) {
    super('HttpError')

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype)
  }

  getErrorMsg(): string {
    const normalizedName = this.getReadableCamelCase(this.name)

    return `${normalizedName} ${this.status}: ${this.message}`
  }
}
