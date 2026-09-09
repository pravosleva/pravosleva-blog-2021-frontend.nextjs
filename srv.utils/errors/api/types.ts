export namespace NResponseLocal {
  export interface IResult<T> {
    isOk: boolean
    response?: T
    message?: string
  }

  export interface IResultSuccess {
    isOk: boolean
    response: any
  }

  export interface IResultError {
    isOk: boolean
    message: string
  }
}
