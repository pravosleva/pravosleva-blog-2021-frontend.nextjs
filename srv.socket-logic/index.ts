import { Socket } from 'socket.io'
import { withAdminPanel } from './withAdminPanel'
import { withLab } from './withLab'
import { withAuditListSocketLogic } from './withAuditListSocketLogic'
import { withSP } from './withSP'

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
  withAdminPanel,
  withLab,
  withSP,
  withAuditListSocketLogic,
  // TODO: etc.
], io)
