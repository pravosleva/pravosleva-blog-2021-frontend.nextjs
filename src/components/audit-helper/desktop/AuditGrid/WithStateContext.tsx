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
