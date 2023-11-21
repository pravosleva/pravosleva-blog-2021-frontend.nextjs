import { Socket } from 'socket.io'
import { withAuditListSocketLogic } from './withAuditListSocketLogic'
import { withLab } from './withLab'
import { withLSP } from './withSP'

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
  withLSP,
  withAuditListSocketLogic,
  // TODO: etc.
], io)
