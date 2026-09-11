import axios, {
  AxiosRequestConfig as IAxiosRequestConfig,
  AxiosInstance as IAxiosInstance,
} from 'axios';
import axiosRetry from 'axios-retry'
import { apiErrorHandler, NResponseLocal } from '~/srv.utils/errors/api'
import { httpErrorHandler } from '~/srv.utils/errors/http/axios'
import { axiosUniversalCatch } from '~/srv.utils/errors/axiosUniversalCatch'

class httpClientSingletone {
  static _instance = new httpClientSingletone();
  api: IAxiosInstance;

  constructor() {
    if (httpClientSingletone._instance) {
      throw new Error(
        'Instantiation failed: use httpClientSingletone.getInstance() instead of new.'
      );
    }
    const baseConfig: IAxiosRequestConfig = {
      baseURL: 'https://pravosleva.pro',
      validateStatus: (_s: number) => true,
    }

    this.api = axios.create(baseConfig)
    axiosRetry(this.api, { retries: 10 })
  }

  static getInstance() {
    return httpClientSingletone._instance;
  }

  public async get<T>(url: string): Promise<NResponseLocal.IResult<T>> {
    return await this.api
      .get(url)
      .then(httpErrorHandler) // res -> res.data
      .then(apiErrorHandler) // data -> data
      .then((data: any) => ({
        isOk: data?.success === true,
        response: data,
      }))
      .catch(axiosUniversalCatch)
  }
  public async getNoApiErr<T>(url: string): Promise<NResponseLocal.IResult<T>> {
    return await this.api
      .get(url)
      .then(httpErrorHandler) // res -> res.data
      .then((data: any) => ({
        isOk: true,
        response: data,
      }))
      .catch(axiosUniversalCatch)
  }
  public async post<T>(url: string, data?: any): Promise<NResponseLocal.IResult<T>> {
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
