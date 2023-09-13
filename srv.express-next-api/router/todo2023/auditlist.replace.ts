import { Request as IRequest, Response as IResponse } from 'express'

export const auditlistReplace = (_req: IRequest, res: IResponse) => {
  res.status(200).send({
    ok: true
  })
}
