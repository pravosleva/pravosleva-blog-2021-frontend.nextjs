import { HttpError } from '~/srv.utils/errors/http/HttpError'
import { AxiosResponse } from 'axios'

export const httpErrorHandler = (obj: AxiosResponse): any | HttpError => {
  console.log(obj)
  /* NOTE: obj[key] example
  data: {
    data: null,
    error: {
      status: 400,
      name: 'ValidationError',
      message: 'namespace must be at least 3 characters',
      details: [Object]
    }
  }
  */
  if (obj.status === 200) return obj.data
  else {
    const msgs = []
    if (!!obj?.config?.url) msgs.push(obj.config.url)
    if (!!obj?.data?.msg) msgs.push(obj.data.msg)
    else if (!!obj?.request?.res?.statusMessage) msgs.push(obj.request.res.statusMessage)

    // NOTE: Target error from Strapi
    if (!!obj?.data?.error?.name && typeof obj?.data?.error?.name === 'string') msgs.push(obj?.data?.error?.name)
    if (!!obj?.data?.error?.message && typeof obj?.data?.error?.message === 'string') msgs.push(obj?.data?.error?.message)

    const commonMsg = msgs.join(' • ')
    throw new HttpError(obj.request?.res?.statusCode || obj.status, commonMsg)
  }
}
