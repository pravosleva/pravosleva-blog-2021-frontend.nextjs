import { ApiError } from './ApiError'

export const apiErrorHandler = (res: any): any | ApiError => {
  if (res?.ok) {
    // Or like Uremont: res.success === 1
    return res
  } else {
    throw new ApiError(res?.message || 'No API res.message')
  }
}
