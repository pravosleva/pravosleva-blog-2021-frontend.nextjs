import axios, { AxiosResponse as IAxiosResponse } from 'axios';
import axiosRetry from 'axios-retry'
import { TAudit } from '~/components/ToDo2023.offline/state/types';

const isDev = process.env.NODE_ENV === 'development'
const remoteExpressApiBaseURL = isDev ? 'http://pravosleva.ru/express-helper/subprojects/gapi/todo-2023' // 'http://localhost:5000/subprojects/gapi/todo-2023'
: 'https://pravosleva.ru/express-helper/subprojects/gapi/todo-2023' // process.env.API_ENDPOINT || '';

const localNextApiBaseURL = isDev ? 'http://localhost:3000/express-next-api/todo-2023' // 'http://localhost:5000/subprojects/gapi/todo-2023'
: 'https://pravosleva.ru/express-next-api/todo-2023' // process.env.API_ENDPOINT || '';

enum EControllers {
  GET_JOBS = 'post:/jobs',
  REPLACE_AUDITS_IN_ROOM = 'post:/replace-audits-in-room',
}

type TLocalResult = {
  isOk: boolean;
  res: {
    data: any;
  }
};

// type TGetUserDataParams = {
//   tg: {
//     chat_id: number;
//   }
// }

// const universalErrCatch = (err: any): TLocalResult => {
//   // @ts-ignore
//   if (!!window?.Sentry) window.Sentry.captureException(err);
//   return { isOk: false, data: err };
// };

class httpClientSingletone {
  static _instance = new httpClientSingletone();
  checkStateController: any;
  getSubsidiesController: any;
  remoteExpressApi: any;
  localNextApi: any;
  controllers: { [key in EControllers]: any }; // AbortController | null

  constructor() {
    if (httpClientSingletone._instance) {
      throw new Error(
        'Instantiation failed: use httpClientSingletone.getInstance() instead of new.'
      );
    }
    this.remoteExpressApi = axios.create({
      baseURL: remoteExpressApiBaseURL,
      validateStatus: (_s: number) => true,
    })
    axiosRetry(this.remoteExpressApi, { retries: 10 })
    this.localNextApi = axios.create({
      baseURL: localNextApiBaseURL,
      validateStatus: (_s: number) => true,
    })
    axiosRetry(this.localNextApi, { retries: 10 })
    this.controllers = {
      [EControllers.GET_JOBS]: null,
      [EControllers.REPLACE_AUDITS_IN_ROOM]: null,
      // Others...
    }
  }

  static getInstance() {
    return httpClientSingletone._instance;
  }
  universalAxiosResponseHandler(validator: (res: any) => boolean) {
    return (axiosRes: IAxiosResponse) => {
      if (!validator(axiosRes)) {
        throw new Error(`${axiosRes.status}: ${axiosRes.statusText} (incorrect data)`)
      }
      try {
        return { isOk: true, res: axiosRes.data }
      } catch (err: any) {
        throw new Error(err.message || `${axiosRes.status}: ${axiosRes.statusText}`)
      }
    }
  }
  getErrorMsg(data: any) {
    // console.log(data)
    return data?.message ? data?.message : 'Извините, что-то пошло не так'
  }

  async getJobs() {
    // data: TGetUserDataParams
    const opts: any = {
      method: 'POST',
      // data,
    }
    if (typeof window !== 'undefined') {
      if (!!this.controllers[EControllers.GET_JOBS]) this.controllers[EControllers.GET_JOBS].abort()

      this.controllers[EControllers.GET_JOBS] = new AbortController()
      opts.signal = this.controllers[EControllers.GET_JOBS].signal
    }
    const result: TLocalResult = await this.remoteExpressApi('/jobs', opts)
      .then(this.universalAxiosResponseHandler(({ data }) => data?.ok === true && Array.isArray(data.jobs)))
      .catch((err: any) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          console.log(err)
        }
        return { isOk: false, message: err.message || 'No err.message' }
      })

    this.controllers[EControllers.GET_JOBS] = null
    if (result.isOk) return Promise.resolve(result.res)

    return Promise.reject({ message: this.getErrorMsg(result) })
  }

  async replaceAuditsInRoom(data: {
    audits: TAudit[];
    room: number;
  }) {
    const opts: any = {
      method: 'POST',
      data,
    }
    if (typeof window !== 'undefined') {
      if (!!this.controllers[EControllers.REPLACE_AUDITS_IN_ROOM]) this.controllers[EControllers.REPLACE_AUDITS_IN_ROOM].abort()

      this.controllers[EControllers.REPLACE_AUDITS_IN_ROOM] = new AbortController()
      opts.signal = this.controllers[EControllers.REPLACE_AUDITS_IN_ROOM].signal
    }
    const result: TLocalResult = await this.localNextApi('/replace-audits-in-room', opts)
    .then(this.universalAxiosResponseHandler(({ data }) => data?.ok === true && Array.isArray(data?.audits)))
    .catch((err: any) => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message)
      } else {
        console.log(err)
      }
      return { isOk: false, message: err.message || 'No err.message' }
    })

  this.controllers[EControllers.REPLACE_AUDITS_IN_ROOM] = null
  if (result.isOk) return Promise.resolve(result.res)

  return Promise.reject({ message: this.getErrorMsg(result) })
  }
}

export const todo2023HttpClient = httpClientSingletone.getInstance();
