import { wrapper } from '~/store'
import { NextPageContext as INextPageContext } from 'next'
import Head from 'next/head'
import { Todo2023Online } from '~/components/Todo2023.online/Todo2023Online'
import { ErrorPage } from '~/components/ErrorPage'
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { enableBrowserMemoryMonitor } from '~/store/reducers/customDevTools'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'

interface IPageContext extends INextPageContext {
  req: any;
}

type TPageService = {
  isOk: boolean;
  message?: string;
}

const TodoOnline = ({ chat_id, _pageService }: {
  chat_id: number;
  _pageService: TPageService;
}) => {
  return (
    <>
      <Head>
        <title>AuditList | Online</title>
        <meta name="robots" content="noindex, nofollow" />
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        <link rel="stylesheet" href="/static/css/min/audit-list.css?v=0" />
      </Head>
      {
        _pageService.isOk
        ? (
          <div className='audit-list-page-wrapper-2026--with-left-widget'>
            <Todo2023Online room={chat_id} />
          </div>
        ) : (
          <ErrorPage
            message={_pageService.message || 'ERR: No _pageService.message'}
          />
        )
      }
    </>
  );
}

const getInitialPropsWithStore = async ({
  ctx,
  store,
}: {
  ctx: IPageContext;
  store: any;
}) => {
  const baseProps = await getInitialPropsBase(ctx)

  if (baseProps.devTools.isClientPerfWidgetOpened)
    store.dispatch(enableBrowserMemoryMonitor())

  const { query: { tg_chat_id } } = ctx
  const _pageService: TPageService = {
    isOk: true,
  }

  // const result = await autoparkHttpClient.checkJWT({ tested_chat_id: tg_chat_id })
  //   .then((res) => res)
  //   .catch((err) => err.message || 'Unknown err (GIPP)')
  // if (result?.ok === true) store.dispatch(setIsOneTimePasswordCorrect(true))

  switch (true) {
    case !tg_chat_id || isNaN(Number(tg_chat_id)):
      _pageService.isOk = false
      _pageService.message = `Incorrect page param (number expected), received: \`${tg_chat_id}\``
      break
    // NOTE: For ssr only?
    case baseProps.authData.oneTime.jwt.isAuthorized: {
      store.dispatch(setIsOneTimePasswordCorrect(true))
      break
    }
    case baseProps.authData.oneTime.jwt._service.isErrored: {
      _pageService.isOk = false
      _pageService.message = baseProps.authData.oneTime.jwt._service.message || 'ERR1 (No err.message)'
      break
    }
    default:
      break
  }

  setCommonStore({ store, baseProps })

  return {
    ...baseProps,
    x: 1,

    chat_id: Number(tg_chat_id),
    _pageService,
  }
}

TodoOnline.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => (ctx: IPageContext) => getInitialPropsWithStore({ ctx, store })
)

export default TodoOnline
