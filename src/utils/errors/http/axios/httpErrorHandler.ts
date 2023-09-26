import { HttpError } from '~/utils/errors/http/HttpError'
import { AxiosResponse } from 'axios'

export const httpErrorHandler = (obj: AxiosResponse): any | HttpError => {
  if (obj.status === 200) {
    return obj.data
  } else {
    throw new HttpError(obj.request?.status, obj.request?.statusText)
  }
}
