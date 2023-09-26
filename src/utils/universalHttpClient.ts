import axios, {
  // AxiosResponse as IAxiosResponse,
  AxiosRequestConfig as IAxiosRequestConfig,
  AxiosInstance as IAxiosInstance,
} from 'axios';
import axiosRetry from 'axios-retry'

// import { getNormalizedInputs } from '@/utils/strapi/getNormalizedInputs'
import { apiErrorHandler, NResponseLocal } from '@/utils/errors/api'
import { httpErrorHandler } from '@/utils/errors/http/axios'
import { axiosUniversalCatch } from '@/utils/errors/axiosUniversalCatch'

// const isDev = process.env.NODE_ENV === 'development'
// const baseApiURL = isDev ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
// : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022' // process.env.API_ENDPOINT || '';

const baseConfig: IAxiosRequestConfig = {
  baseURL: 'http://pravosleva.ru/',
  // headers: {
  //   'Origin': 'http://localhost:1337',
  //   'Access-Control-Allow-Origin': '*',
  // },
  validateStatus: (_s: number) => true,
}


// const universalErrCatch = (err: any): TLocalResult => {
//   // @ts-ignore
//   if (!!window?.Sentry) window.Sentry.captureException(err);
//   return { isOk: false, data: err };
// };

class httpClientSingletone {
  static _instance = new httpClientSingletone();
  recaptchaV3Controller: any;
  api: IAxiosInstance;
  // controllers: { [key: string]: any }; // AbortController | null

  constructor() {
    if (httpClientSingletone._instance) {
      throw new Error(
        'Instantiation failed: use httpClientSingletone.getInstance() instead of new.'
      );
    }
    this.api = axios.create(baseConfig)
    axiosRetry(this.api, { retries: 10 })
    // this.controllers = {}
  }

  static getInstance() {
    return httpClientSingletone._instance;
  }

  public async post(url: string, data: URLSearchParams): Promise<NResponseLocal.IResult> {
    return await this.api
      .post(url, data)
      .then(httpErrorHandler) // res -> res.data
      .then(apiErrorHandler) // data -> data
      .then((data: any) => ({
        isOk: true,
        response: data,
      }))
      .catch(axiosUniversalCatch)
  }
}

export const universalHttpClient = httpClientSingletone.getInstance();
