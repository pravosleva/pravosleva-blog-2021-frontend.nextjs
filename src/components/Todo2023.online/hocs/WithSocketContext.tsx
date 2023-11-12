// import { Socket } from 'socket.io-client'
import { TAudit, NTodo } from '~/components/audit-helper'
import createFastContext from '~/context/createFastContext'

export type TSocketMicroStore = {
  isConnected: boolean;
  audits: TAudit[];
  common: {
    roomState: NTodo.TRoomState | null;
  };
  todoPriorityFilter: number | null;
  todoStatusFilter: NTodo.EStatus | null;
}
const { Provider, useStore } = createFastContext<TSocketMicroStore>({
  isConnected: false,
  audits: [],
  common: {
    roomState: null,
  },
  todoPriorityFilter: null,
  todoStatusFilter: null,
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
