// import { Socket } from 'socket.io-client'
import { TAudit } from "~/components/ToDo2023.offline/state/types";
import createFastContext from "~/context/createFastContext";

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
