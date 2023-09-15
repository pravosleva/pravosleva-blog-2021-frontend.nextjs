import {
  Request as IRequest,
  Response as IResponse,
  NextFunction as INextFunction,
} from 'express'
import { THelp } from './types'

type TProps = {
  rules: THelp
}

export const withReqParamsValidationMW =
  ({ rules }: TProps) =>
  (req: IRequest, res: IResponse, next: INextFunction) => {
    // -- NOTE: Errs handler
    const errs: { msg: string, _reponseDetails?: any }[] = []

    for (const reqProp in rules.params) {
      switch (reqProp) {
        case 'body':
        case 'query':
          for (const key in rules.params[reqProp]) {

            if (rules.params[reqProp]?.[key]?.required && !req[reqProp][key]) {
              const validationResult = rules.params[reqProp]?.[key]?.validate(req[reqProp][key])
              const errOpts: any = {
                msg: `Missing required param: \`req.${reqProp}.${key}\` (${rules.params[reqProp]?.[key].type}: ${rules.params[reqProp]?.[key].descr})${!!validationResult?.reason ? ` | ⚠️ By developer: ${validationResult?.reason}` : ''}`
              }
              
              if (!!validationResult?._reponseDetails)
                errOpts._reponseDetails = validationResult._reponseDetails

              errs.push(errOpts)
            } else {
              // -- NOTE: Если имеется необязательный параметр, проверим его
              if (!!req[reqProp]?.[key]) {
                try {
                  const validationResult = rules.params[reqProp]?.[key]?.validate(req[reqProp]?.[key])
  
                  if (!validationResult?.ok) {
                    const errOpts: {
                      msg: string;
                      _reponseDetails?: {
                        status: number;
                        [key: string]: any;
                      }
                    } = {
                      msg: `Incorrect request param format: \`req.${reqProp}.${key}\` (${rules.params[reqProp]?.[key].descr}) expected: ${rules.params[reqProp]?.[key].type}. Received: ${typeof req[reqProp][key]}${!!validationResult?.reason ? ` | ⚠️ By developer: ${validationResult.reason}` : ''}`,
                    }
                    if (!!validationResult?._reponseDetails)
                      errOpts._reponseDetails = validationResult._reponseDetails
  
                    errs.push(errOpts)
                  }
                } catch (err) {
                  errs.push({
                    // @ts-ignore
                    msg: `Не удалось проверить поле: \`req.${reqProp}.${key}\` (${rules.params[reqProp]?.[key].descr}); ${typeof err === 'string' ? err : (err?.message || 'No err.message')}`
                  })
                }
              }
              // --
            }
          }
          break
        default:
          break
      }
    }

    if (errs.length > 0) {
      let status = 400
      const result: any = {
        ok: false,
        message: `⛔ ERR! ${errs.map(({ msg }) => msg).join('; ')}`,
        _service: {
          originalBody: req.body,
          originalQuery: req.query,
          rules,
        }
      }

      // -- NOTE: Пробуем добавить детали первой ошибки результатов обработки в ответ (если они есть)
      try {
        // NOTE: v1 Добавить, если они имеются только у превой ошибки
        // if (!!errs[0]._reponseDetails) {
        //   const { status: newStatus, _addProps } = errs[0]._reponseDetails
        //   status = newStatus
        //   if (!!_addProps && Object.keys(_addProps).length > 0) {
        //     for (const key in _addProps) result[key] = _addProps[key]
        //   }
        // }

        // NOTE: v2 А если для этой нет? Нужно ли добавить детали хотя бы для одной ошибки из имеющихся?
        let _reponseDetails: any = null
        for (const err of errs) {
          if (!!err._reponseDetails) {
            _reponseDetails = err._reponseDetails
            break
          }
        }
        if (!!_reponseDetails) {
          const { status: newStatus, _addProps } = _reponseDetails
          status = newStatus
          if (!!_addProps && Object.keys(_addProps).length > 0) {
            for (const key in _addProps) result[key] = _addProps[key]
          }
        }
      } catch (err) {
        // @ts-ignore
        result._service.message = typeof err === 'string' ? err : (err?.message || 'No err.message')
      }
      // --
      
      return res.status(status).send(result)
    }
    // --

    return next()
  }
