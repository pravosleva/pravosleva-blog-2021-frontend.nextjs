import { HttpError } from '~/srv.utils/errors/http/HttpError'
import { AxiosResponse } from 'axios'

export const httpErrorHandler = (obj: AxiosResponse): any | HttpError => {
  if (obj.status === 200) {
    return obj.data
  } else {
    // console.log(obj.request.res)
    // console.log(obj.data)
    switch (true) {
      case !!obj?.data:
        throw new HttpError(obj.request?.res?.statusCode, obj?.data?.msg || obj.request?.res?.statusMessage)
      default:
        throw new HttpError(obj.request?.res?.statusCode, obj.request?.res?.statusMessage)
    }
  }
}
