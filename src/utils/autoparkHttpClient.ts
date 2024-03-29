import axios, {
  AxiosResponse as IAxiosResponse,
  AxiosInstance as IAxiosInstance,
} from 'axios';
import axiosRetry from 'axios-retry'

const isDev = process.env.NODE_ENV === 'development'
const baseApiURL = isDev ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022' // process.env.API_ENDPOINT || '';

enum EControllers {
  CHECK_USER = 'check-user',
  CHECK_JWT = 'check-jwt',
}

type TLocalResult = {
  isOk: boolean;
  res?: {
    data: any;
  };
  message?: string;
};

type TGetUserDataParams = {
  tg: {
    chat_id: number;
  }
}

// const universalErrCatch = (err: any): TLocalResult => {
//   // @ts-ignore
//   if (!!window?.Sentry) window.Sentry.captureException(err);
//   return { isOk: false, data: err };
// };

class httpClientSingletone {
  static _instance = new httpClientSingletone();
  checkStateController: any;
  getSubsidiesController: any;
  api: IAxiosInstance;
  controllers: { [key: string]: any }; // AbortController | null

  constructor() {
    if (httpClientSingletone._instance) {
      throw new Error(
        'Instantiation failed: use httpClientSingletone.getInstance() instead of new.'
      );
    }
    this.api = axios.create({
      baseURL: baseApiURL,
      validateStatus: (_s: number) => true,
      withCredentials: true,
    })
    axiosRetry(this.api, { retries: 10 })
    this.controllers = {}
  }

  static getInstance() {
    return httpClientSingletone._instance;
  }
  universalAxiosResponseHandler(validator: (res: any) => boolean) {
    return (axiosRes: IAxiosResponse) => {
      try {
        // console.log(axiosRes)
        if (!validator(axiosRes)) {
          throw new Error(`Data is incorrect / ${axiosRes.status}: ${axiosRes.statusText} / ${axiosRes.data.message || 'No data.message'}`)
        }
        return { isOk: true, res: axiosRes.data }
      } catch (err: any) {
        throw new Error(err?.message || 'Unknown error')
      }
    }
  }
  getErrorMsg(data: any) {
    return data?.message || 'Извините, что-то пошло не так'
  }

  async getUserData(data: TGetUserDataParams) {
    const opts: any = {
      method: 'POST',
      data,
    }
    if (typeof window !== 'undefined') {
      if (!!this.controllers[EControllers.CHECK_USER]) this.controllers[EControllers.CHECK_USER].abort()

      this.controllers[EControllers.CHECK_USER] = new AbortController()
      opts.signal = this.controllers[EControllers.CHECK_USER].signal
    }
    const result: TLocalResult = await this.api('/check-user', opts)
      .then(this.universalAxiosResponseHandler(({ data }) => data?.ok === true))
      .catch((err: any) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, message: err.message || 'No err.message' }
      })

    this.controllers[EControllers.CHECK_USER] = null
    if (result.isOk) return Promise.resolve(result.res)

    return Promise.reject(this.getErrorMsg(result))
  }

  async checkJWT(data: {
    tested_chat_id: string;
  }) {
    const opts: any = {
      method: 'POST',
      data,

    }
    
    if (typeof window !== 'undefined') {
      if (!!this.controllers[EControllers.CHECK_JWT]) this.controllers[EControllers.CHECK_JWT].abort()

      this.controllers[EControllers.CHECK_JWT] = new AbortController()
      opts.signal = this.controllers[EControllers.CHECK_JWT].signal
    }
    const result: TLocalResult = await this.api('/check-jwt', opts)
      .then(this.universalAxiosResponseHandler(({ data }) => data?.ok === true))
      .catch((err: any) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, message: err.message || 'No err.message' }
      })

    this.controllers[EControllers.CHECK_JWT] = null
    if (result.isOk) return Promise.resolve(result.res)

    return Promise.reject(this.getErrorMsg(result))
  }
}

export const autoparkHttpClient = httpClientSingletone.getInstance();
