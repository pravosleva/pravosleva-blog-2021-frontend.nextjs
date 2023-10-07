// import { Socket } from 'socket.io-client'
import createFastContext from '~/context/createFastContext'

export type TSocketMicroStore = {
  isConnected: boolean;
}
const { Provider, useStore } = createFastContext<TSocketMicroStore>({
  isConnected: false,
});

export const WithSocketContextHOC = ({ children }: any) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

export namespace NEvent {
  export enum ServerIncoming {
    TEST = 'lab:client:tst-action',
    WANNA_BE_CONNECTED_TO_ROOM = 'lab:client:wanna-be-connected-to-room',
  }
  export enum ServerOutgoing {
    TEST = 'lab:server:tst-action',
    SOMEBODY_CONNECTED_TO_ROOM = 'lab:server:somebody-connected',
  }
}

export {
  useStore,
}
