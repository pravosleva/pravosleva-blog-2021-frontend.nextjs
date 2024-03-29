// import { Socket } from 'socket.io-client'
import createFastContext from '~/context/createFastContext'

export type TSocketMicroStore = {
  isConnected: boolean;
  isConnectedToPrivateRoom: boolean;
}
export const initialState = {
  isConnected: false,
  isConnectedToPrivateRoom: false,
}
const { Provider, useStore } = createFastContext<TSocketMicroStore>(initialState);

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
    WANNA_BE_DISCONNECTED_FROM_ROOM = 'lab:client:wanna-be-disconnected-from-room',
  }
  export enum ServerOutgoing {
    TEST = 'lab:server:tst-action',
    SOMEBODY_CONNECTED_TO_ROOM = 'lab:server:somebody-connected',
    COMMON_MESSAGE = 'lab:server:common-message',
  }
}

export {
  useStore,
}
