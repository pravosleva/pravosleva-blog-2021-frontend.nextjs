import { ApiError } from './ApiError'

export const apiErrorHandler = (res: any): any | ApiError => {
  switch (true) {
    // Or like Uremont: res.success === 1
    case res?.ok: // New standart
    case res?.success === true: // Old standart
      return res
    default: {
      // console.log(res)
      throw new ApiError(res?.message || 'No API res.message')
    }
  }
}
