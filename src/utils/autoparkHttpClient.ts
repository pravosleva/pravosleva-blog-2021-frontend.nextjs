import axios, {
  AxiosResponse as IAxiosResponse,
  AxiosInstance as IAxiosInstance,
  CancelTokenSource,
} from 'axios';
import axiosRetry from 'axios-retry'

const isDev = process.env.NODE_ENV === 'development'
const baseApiURL = isDev ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022' // process.env.API_ENDPOINT || '';

// 1. Описание параметров запроса к API
export type TGetUserDataParams = {
  tg: {
    chat_id: number;
  };
}

// 2. Строгий интерфейс элементов и проектов автопарка
export type TItem = {
  name: string;
  description: string;
}

export type TProject = {
  name: string;
  description: string;
  items: TItem[];
}

// 3. ENUM кодов ответов API (Исправлена опечатка в IncorrecrParams -> IncorrectParams)
export enum EAPIUserCode {
  UserExists = 'already_exists',
  IncorrectParams = 'incorrect_params',
  IncorrectBody = 'incorrect_body',
  Updated = 'updated',
  Created = 'created',
  NotFound = 'not_found',
  IncorrectUserName = 'incorrect_username',
  Removed = 'removed',
  ServerError = 'server_error'
}

// 4. Окончательный, чистый тип ответа от эндпоинта /check-user
export type TUserCheckerResponse = {
  ok: boolean;
  code: EAPIUserCode;
  message?: string;
  password?: number;
  projects?: {
    [key: string]: TProject;
  };
}

// 5. Дженерик-тип для локальной прослойки хендлера Axios
type TLocalResult<T> = {
  isOk: boolean;
  res?: T;
  message?: string;
};

export enum EControllers {
  CHECK_USER = 'check-user',
  CHECK_JWT = 'check-jwt',
}

// 1. Строгий тип ответа сервера для эндпоинта /check-jwt
export type TCheckJWTResponse = {
  ok: boolean;
  message?: string;
  // Добавьте сюда другие специфические свойства из ответа вашего API, если они есть
};

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
  /**
   * Универсальный обработчик ответов Axios с поддержкой Generic-типов данных
   */
  private universalAxiosResponseHandler<T>(validator: (res: any) => boolean) {
    return (axiosRes: { status: number; statusText: string; data: T & { message?: string } }) => {
      try {
        if (!validator(axiosRes)) {
          throw new Error(
            `Data is incorrect / ${axiosRes.status}: ${axiosRes.statusText} / ${axiosRes.data.message || 'No data.message'}`
          )
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

  // =========================================================================
  // 🔥 ОТРЕФАКТОРЕННЫЙ И СТРОГО ТИПИЗИРОВАННЫЙ МЕТОД GET_USER_DATA
  // =========================================================================
  public async getUserData(data: TGetUserDataParams): Promise<TUserCheckerResponse> {
    const opts: any = {
      method: 'POST',
      data,
    }

    // Контроль AbortSignal работает строго в браузере при SPA переходах
    if (typeof window !== 'undefined') {
      if (this.controllers[EControllers.CHECK_USER]) {
        this.controllers[EControllers.CHECK_USER]?.abort()
      }

      const controller = new AbortController()
      this.controllers[EControllers.CHECK_USER] = controller
      opts.signal = controller.signal
    }

    try {
      // Передаем дженериком TUserCheckerResponse в хендлер валидации
      const result: TLocalResult<TUserCheckerResponse> = await this.api('/check-user', opts)
        .then(this.universalAxiosResponseHandler<TUserCheckerResponse>(() => true)) // Валидатор всегда true, структуру разберем ниже
        .catch((err: any) => {
          if (axios.isCancel(err)) {
            console.log('📡 [API]: Запрос к /check-user успешно отменен AbortController-ом')
          } else {
            console.error('🚨 [API Error]: Сбой выполнения запроса к /check-user', err)
          }
          
          // Возвращаем типизированную структуру ошибки вместо падения рантайма
          return { 
            isOk: false, 
            message: err.message || 'No err.message' 
          }
        })

      // Сбрасываем контроллер текущего потока в null
      if (typeof window !== 'undefined') {
        this.controllers[EControllers.CHECK_USER] = null
      }

      // Если сетевой запрос прошел успешно и валидатор не выбросил исключение
      if (result.isOk && result.res) {
        return result.res
      }

      // Если произошла сетевая ошибка — возвращаем безопасный объект со статусом server_error
      return {
        ok: false,
        code: EAPIUserCode.ServerError,
        message: this.getErrorMsg(result)
      }

    } catch (criticalErr: any) {
      // Глухой защитный барьер верхнего уровня
      return {
        ok: false,
        code: EAPIUserCode.ServerError,
        message: criticalErr?.message || 'Критический сбой десериализации данных.'
      }
    }
  }

  /**
   * Проверка валидности сессионного JWT токена
   * Идентичен по логике рантайма, но строго типизирован дженериками
   */
  public async checkJWT(data: { tested_chat_id: string }): Promise<TCheckJWTResponse> {
    const opts: any = {
      method: 'POST',
      data,
    }
    
    // Контроль AbortSignal в браузере для предотвращения Race Condition при SPA-кликах
    if (typeof window !== 'undefined') {
      if (this.controllers[EControllers.CHECK_JWT]) {
        this.controllers[EControllers.CHECK_JWT]?.abort()
      }

      const controller = new AbortController()
      this.controllers[EControllers.CHECK_JWT] = controller
      opts.signal = controller.signal
    }

    // Запускаем асинхронный сетевой шлюз с подстановкой дженерика TCheckJWTResponse
    const result: TLocalResult<TCheckJWTResponse> = await this.api('/check-jwt', opts)
      .then(
        // Валидатор проверяет, что ответ вернул ok === true, как в вашем исходном коде
        this.universalAxiosResponseHandler<TCheckJWTResponse>(
          (axiosRes) => axiosRes?.data?.ok === true
        )
      )
      .catch((err: any) => {
        if (axios.isCancel(err)) {
          console.log('📡 [API]: Запрос к /check-jwt успешно отменен AbortController-ом', err.message)
        } else {
          console.error('🚨 [API Error]: Сбой валидации JWT токена', err)
        }
        
        return { 
          isOk: false, 
          message: err.message || 'No err.message' 
        }
      })

    // Очищаем ссылку на контроллер текущего потока в window-рантайме
    if (typeof window !== 'undefined') {
      this.controllers[EControllers.CHECK_JWT] = null
    }

    // --- СОХРАНЕНИЕ 100% СТАБИЛЬНОСТИ И РАБОТОСПОСОБНОСТИ ЛЕГАСИ ЦЕПОЧЕК ---
    if (result.isOk && result.res) {
      // Возвращаем чистый типизированный объект ответа в успешный промис
      return Promise.resolve(result.res)
    }

    // В случае сбоя или ok === false выкидываем ошибку, как и ожидает ваш код страниц
    return Promise.reject(this.getErrorMsg(result))
  }
}

export const autoparkHttpClient = httpClientSingletone.getInstance();
