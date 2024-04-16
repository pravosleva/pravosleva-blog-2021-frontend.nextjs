import { NetworkError } from './NetworkError'

export const networkErrorHandler = (res: any): any | NetworkError => {
  if (!!res.status) return res
  else throw new NetworkError(`typeof res.status is [${typeof res.status}]`)
}
