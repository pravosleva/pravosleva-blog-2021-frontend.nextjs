export namespace NResponseLocal {
  export interface IResult {
    ok: boolean
    response?: any
    message?: string
  }

  export interface IResultSuccess {
    ok: boolean
    response: any
  }

  export interface IResultError {
    ok: boolean
    message?: string
  }
}
