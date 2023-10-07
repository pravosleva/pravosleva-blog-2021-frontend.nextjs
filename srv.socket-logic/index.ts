import { Socket } from 'socket.io'
import { withAuditListSocketLogic } from './audit-list/withAuditListSocketLogic'
import { withLab } from './withLab'

const compose = (fns: ((io: Socket) => void)[], io: Socket) => {
  return fns.reduce(
    (acc: number, fn): number => {
      fn(io)
      acc += 1
      return acc
    },
    0
  )
}

export const rootSocketLogic = (io: Socket) => compose([
  withLab,
  withAuditListSocketLogic,
  // TODO: etc.
], io)
