import { HttpError } from '~/srv.utils/errors/http/HttpError'
import { AxiosResponse } from 'axios'

export const httpErrorHandler = (obj: AxiosResponse): any | HttpError => {
  if (obj.status === 200) return obj.data
  else {
    const msgs = []
    if (!!obj?.config?.url) msgs.push(obj.config.url)
    if (!!obj?.data?.msg) msgs.push(obj.data.msg)
    else if (!!obj?.request?.res?.statusMessage) msgs.push(obj.request.res.statusMessage)

    const commonMsg = msgs.join(' • ')
    throw new HttpError(obj.request?.res?.statusCode || obj.status, commonMsg)
  }
}
