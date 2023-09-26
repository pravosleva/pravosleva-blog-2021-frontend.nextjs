import { UniversalError } from '~/utils/errors'
import { NetworkError } from '~/utils/errors/network'
import { HttpError } from '~/utils/errors/http'
import { ApiError, NResponseLocal } from '~/utils/errors/api'

export const axiosUniversalCatch = (err: {
  isAxiosError: boolean
  response: { request: { status: any; statusText: any } }
  request: any
  getErrorMsg: () => any
  message: any
}): NResponseLocal.IResultSuccess | NResponseLocal.IResultError => {
  switch (true) {
    case err.isAxiosError:
      try {
        if (!!err.response) {
          throw new HttpError(err.response.request.status, err.response.request.statusText)
        } else if (!!err.request)
          throw new NetworkError('ERR: Client never received a response, or request never left')
        else throw new UniversalError('Request failed')
      } catch (err: any) {
        return {
          isOk: false,
          msg: err.getErrorMsg(),
        }
      }
    // NOTE 2
    // Доп. обрабочики (помимо apiResponseErrorHandler) будут нужны,
    // если настройки options будут позволять провалиться дальше: axios по умолчанию все перехватит сам
    // (см. обработку выше)
    case err instanceof NetworkError:
    case err instanceof HttpError:
    case err instanceof ApiError:
      // case Object.getPrototypeOf(err).name === 'Error':
      return {
        isOk: false,
        msg: err.getErrorMsg(),
      }
    case err instanceof TypeError:
      // case Object.getPrototypeOf(err).name === 'Error':
      return {
        isOk: false,
        msg: err.message,
      }
    default:
      return {
        isOk: false,
        msg: 'AXIOS ERR: Не удалось обработать ошибку',
      }
  }
}
