export namespace NResponseLocal {
  export interface IResult {
    isOk: boolean
    response?: any
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
