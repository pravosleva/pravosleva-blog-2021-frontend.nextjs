// import { Socket } from 'socket.io-client'
// import { TAudit } from '~/components/audit-helper'
import createFastContext from '~/context/createFastContext'

export type TDesktopAuditState = {
  activeAuditId: string | null;
}
const { Provider, useStore } = createFastContext<TDesktopAuditState>({
  activeAuditId: null,
});

export const WithStateContext = ({ children }: any) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

export {
  useStore,
}
