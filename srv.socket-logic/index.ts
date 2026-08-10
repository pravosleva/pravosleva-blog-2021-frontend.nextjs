import { Server } from 'socket.io'
import { withAdminPanel } from './withAdminPanel'
import { withLab } from './withLab'
import { withAuditListSocketLogic } from './withAuditListSocketLogic'
import { withSP } from './withSP'
import { withExperimental } from './withExperimental'
import { withReactiveChat } from './withReactiveChat'

const compose = (fns: ((io: Server) => void)[], io: Server) => {
  return fns.reduce(
    (acc: Server, fn): Server => {
      fn(io)
      // acc += 1
      return acc
    },
    io
  )
}

export const rootSocketLogic = (io: Server) => compose([
  withAdminPanel,
  withLab,
  withSP,
  withAuditListSocketLogic,
  withExperimental,
  withReactiveChat,

  // TODO: etc.
], io)
