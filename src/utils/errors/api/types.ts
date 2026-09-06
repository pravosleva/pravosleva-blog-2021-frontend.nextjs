export namespace NResponseLocal {
  export interface IResult<T> {
    ok: boolean
    response?: T
    message?: string
  }

  export interface IResultSuccess<T> {
    ok: boolean
    response: T
  }

  export interface IResultError {
    ok: boolean
    message?: string
  }
}
