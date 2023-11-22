import { UniversalError } from '~/utils/errors'
import { NetworkError } from '~/utils/errors/network'
import { HttpError } from '~/utils/errors/http'
import { ApiError, NResponseLocal } from '~/utils/errors/api'

export const axiosUniversalCatch = (err: {
  errno: number; // -111,
  code: string; // 'ECONNREFUSED',
  syscall: string; // 'connect',
  address: string; // '127.0.0.1',
  port: number;
  config: {
    url: string;
    method: string; // post
    baseURL: string; // 'http://localhost:1337/graphql',
    // 'axios-retry': { retryCount: 10, lastRequestTime: 1700484271813 }
  };
  isAxiosError: boolean;
  response: { request: { status: any; statusText: any } };
  request: any;
  getErrorMsg: () => any;
  message: any;
}): NResponseLocal.IResultSuccess | NResponseLocal.IResultError => {
  let commonMsg = err?.message || 'Unknown ERR'
  switch (true) {
    case err.isAxiosError:
      commonMsg = `${err?.config?.baseURL}${err?.config?.url}`
      try {
        if (!!err.response) {
          throw new HttpError(err.response.request.status, err.response.request.statusText)
        } else if (!!err.request)
          throw new NetworkError(`${commonMsg} -> Client never received a response, or request never left`)
        else throw new UniversalError(`${commonMsg} -> Request failed`)
      } catch (err: any) {
        return {
          ok: false,
          message: err.getErrorMsg(),
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
        ok: false,
        message: err.getErrorMsg(),
      }
    case err instanceof TypeError:
      // case Object.getPrototypeOf(err).name === 'Error':
      return {
        ok: false,
        message: err.message,
      }
    default:
      return {
        ok: false,
        message: `${commonMsg} -> Не удалось обработать ошибку`,
      }
  }
}
