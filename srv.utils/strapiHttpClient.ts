import axios, {
  // AxiosResponse as IAxiosResponse,
  AxiosRequestConfig as IAxiosRequestConfig,
  AxiosInstance as IAxiosInstance,
} from 'axios';
import axiosRetry from 'axios-retry'

// import { getNormalizedInputs } from '@/utils/strapi/getNormalizedInputs'
import {
  ApiError,
  // apiErrorHandler,
  NResponseLocal,
} from '~/srv.utils/errors/api'
import { httpErrorHandler } from '~/srv.utils/errors/http/axios'
import { axiosUniversalCatch } from '~/srv.utils/errors/axiosUniversalCatch'

// import { ApiError } from '~/srv.utils/errors/api/ApiError'
import { NTodo } from '~/srv.socket-logic/withAuditListSocketLogic/types'

const isDev = process.env.NODE_ENV === 'development'
// const baseApiURL = isDev ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
// : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022' // process.env.API_ENDPOINT || '';

const baseURL = isDev ? 'http://localhost:1337/api' : 'https://pravosleva.pro/strapi/api'
const baseGqlURL = isDev ? 'http://localhost:1337/graphql' : 'https://pravosleva.pro/strapi/graphql'
const baseConfig: IAxiosRequestConfig = {
  baseURL, // 'http://pravosleva.ru/',
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
  // recaptchaV3Controller: any;
  api: IAxiosInstance;
  gqlApi: IAxiosInstance;
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

    const axiosGqlOpts = {
      baseURL: baseGqlURL,
    }
    this.gqlApi = axios.create(axiosGqlOpts)
    axiosRetry(this.gqlApi, { retries: 10 })
  }

  static getInstance() {
    return httpClientSingletone._instance;
  }

  public async get(url: string): Promise<NResponseLocal.IResult> {
    return await this.api
      .get(url)
      .then(httpErrorHandler) // res -> res.data
      // .then(apiErrorHandler) // data -> data
      .then((res) => {
        console.log('-- get:res')
        console.log(res)
        console.log('--')
        // switch (true) {
        //   case !!res?.data:
        //     return res
        //   default: {
        //     // console.log(res)
        //     throw new ApiError(res?.message || 'GET:ERR / No API res.message')
        //   }
        // }
        return res
      })
      .then((data: any) => ({
        isOk: true,
        response: data,
      }))
      .catch(axiosUniversalCatch)
  }
  public async post(url: string, data?: any): Promise<NResponseLocal.IResult> {
    return await this.api
      .post(url, data)
      .then(httpErrorHandler) // res -> res.data
      // .then(apiErrorHandler) // data -> data
      .then((res) => {
        console.log('-- strapiHttpClient:post:res')
        console.log(res)
        console.log('--')
        // switch (true) {
        //   case res?.data:
        //     return res
        //   default: {
        //     // console.log(res)
        //     throw new ApiError(res?.message || 'POST:ERR / No API res.message')
        //   }
        // }
        return res
      })
      .then((data: any) => ({
        isOk: true,
        response: data,
      }))
      .catch(axiosUniversalCatch)
  }
  public async put(url: string, data?: any): Promise<NResponseLocal.IResult> {
    return await this.api
      .put(url, data)
      .then(httpErrorHandler) // res -> res.data
      // .then(apiErrorHandler) // data -> data
      .then((res) => {
        // console.log(res)
        // switch (true) {
        //   case !!res?.data?.id:
        //     return res
        //   default: {
        //     // console.log(res)
        //     throw new ApiError(res?.message || 'PUT:ERR / No API res.message')
        //   }
        // }
        return res
      })
      .then((data: any) => ({
        isOk: true,
        response: data,
      }))
      .catch(axiosUniversalCatch)
  }
  public async delete(url: string, data?: any): Promise<NResponseLocal.IResult> {
    return await this.api
      .delete(url, data)
      .then(httpErrorHandler) // res -> res.data
      // .then(apiErrorHandler) // data -> data
      .then((res) => {
        // switch (true) {
        //   case res?.data:
        //     return res
        //   default: {
        //     // console.log(res)
        //     throw new ApiError(res?.message || 'DELETE:ERR / No API res.message')
        //   }
        // }
        return res
      })
      .then((data: any) => ({
        isOk: true,
        response: data,
      }))
      .catch(axiosUniversalCatch)
  }

  public async createTodo<T>({ todoItem, namespace, room }: {
    room: number;
    todoItem: NTodo.TItem;
    namespace: string;
  }): Promise<{ ok: boolean; res?: T; message?: string; }> {
    const result = await this.post('/todos', {
      data: {
        label: todoItem.label,
        namespace,
        priority: todoItem.priority,
        tg_chat_id: Number(room),
        status: todoItem.status,
        description: todoItem.description,
      }
    })

    // console.log('-- strapiHttpClient:createTodo:result')
    // console.log(result)
    // console.log('--')

    if (result.isOk && typeof result.response?.data?.id === 'number') return Promise.resolve({
      ok: true,
      res: result.response,
    })
    return Promise.reject({
      ok: true,
      message: result.message || (!!result.response?.data?.error
        ? `${result.response?.data?.error?.status} ${result.response?.data?.error?.message}`
        : 'strapiHttpClient:createTodo:ERR')
    })
  }

  public async updateTodo<T>({ todoId, todoItem, namespace, room }: {
    todoId: number;
    todoItem: NTodo.TItem;
    namespace: string;
    room: number;
  }): Promise<{ ok: boolean; res?: T; message?: string; }> {
    const result = await this.put(`/todos/${todoId}`, {
      data: {
        label: todoItem.label,
        namespace,
        priority: todoItem.priority,
        tg_chat_id: Number(room),
        status: todoItem.status,
        description: todoItem.description,
      },
    })

    // console.log('-- strapiHttpClient:updateTodo:result')
    // console.log(result)
    // console.log('--')

    if (result.isOk && typeof result.response?.data?.id === 'number') return Promise.resolve({
      ok: true,
      res: result.response,
    })
    return Promise.reject({
      ok: true,
      message: result.message || (!!result.response?.data?.error
        ? `${result.response?.data?.error?.status} ${result.response?.data?.error?.message}`
        : 'strapiHttpClient:updateTodo:ERR')
    })
  }

  public async deleteTodo<T>({ todoId }: {
    todoId: number;
  }): Promise<{ ok: boolean; res?: T; message?: string; }> {
    const result = await this.delete(`/todos/${todoId}`)

    if (result.isOk && typeof result.response?.data?.id === 'number') return Promise.resolve({
      ok: true,
      res: result.response,
    })
    return Promise.reject({
      ok: true,
      message: result.message || (!!result.response?.data?.error
        ? `${result.response?.data?.error?.status} ${result.response?.data?.error?.message}`
        : 'strapiHttpClient:updateTodoERR')
    })
  }

  public async getTodos<T>(): Promise<{ ok: boolean; res?: T; message?: string; }> {
    const result = await this.get('/todos')

    // console.log('-- strapiHttpClient:getTodos:result')
    // console.log(result)
    // console.log('--')

    if (result.isOk && Array.isArray(result.response?.data)) return Promise.resolve({
      ok: true,
      res: result.response,
    })
    return Promise.reject({
      ok: false,
      message: result.message || (!!result.response?.data?.error
        ? `${result.response?.data?.error?.status} ${result.response?.data?.error?.message}`
        : 'strapiHttpClient:getTodos:ERR')
    })
  }

  public async gqlGetTodos({ tg_chat_id }: {
    tg_chat_id: number;
  }): Promise<{
    ok: boolean;
    res?: {
      data: {
        id: string;
        attributes: {
          label: string;
          description: string;
          priority: number;
          status: NTodo.EStatus;
          tg_chat_id: number;
          namespace: string;
        }
      }[]
    };
    message?: string;
  }> {
    const result = await this.gqlApi.post('', {
        query: `{
  todos: todos(
    filters: {
      tg_chat_id: {
        eq: ${tg_chat_id}
      }
    }
    
  ) {
    data {
      id
      attributes {
        label
        description
        priority
        status
        tg_chat_id
        namespace
      }
    }
  }
}`,
        validateStatus: (status: number) => status >= 200 && status < 500, // default
      })
        .then(httpErrorHandler) // res -> res.data
        .then((json) => {
          console.log(json) // NOTE: { data: { todos: { data: [] } } }
          if (Array.isArray(json?.data?.todos?.data))
            return json?.data?.todos

          throw new ApiError('gqlApi:ERR')
          // return data
        }) // data -> data
        .then((data: any) => ({
          isOk: true,
          response: data,
        }))
        .catch(axiosUniversalCatch)

      // console.log('--gqlGetTodos:result')  
      // console.log(result)
      // console.log('--')
      
      if (result.isOk) return Promise.resolve({
        ok: true,
        res: result.response
      })
      return Promise.reject({
        ok: false,
        // @ts-ignore
        message: result.message || 'No message'
      })
  }
}

export const strapiHttpClient = httpClientSingletone.getInstance();
