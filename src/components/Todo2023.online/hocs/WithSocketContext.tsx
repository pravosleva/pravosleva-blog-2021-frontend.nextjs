// import { Socket } from 'socket.io-client'
import { TAudit } from '~/components/audit-helper'
import createFastContext from '~/context/createFastContext'

export type TSocketMicroStore = {
  isConnected: boolean;
  audits: TAudit[];
}
const { Provider, useStore } = createFastContext<TSocketMicroStore>({
  isConnected: false,
  audits: [],
});

export const WithSocketContext = ({ children }: any) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

export {
  useStore,
}
