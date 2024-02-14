// import Container from '@mui/material/Container'
// import Box from '@mui/material/Box'
import { wrapper } from '~/store'
import { NextPageContext as INextPageContext } from 'next'
import Head from 'next/head'
import { Todo2023Online } from '~/components/Todo2023.online/Todo2023Online'
import { ErrorPage } from '~/components/ErrorPage'
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { enableBrowserMemoryMonitor } from '~/store/reducers/customDevTools'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { getInitialPropsBase } from '~/utils/next/getInitialPropsBase'

// const isDev = process.env.NODE_ENV === 'development'
// const baseURL = isDev
//   ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
//   : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'

interface IPageContext extends INextPageContext {
  req: any;
}

type TPageService = {
  isOk: boolean;
  message?: string;
}

const TodoOnline = ({
  chat_id,
  _pageService,
  // ...restProps
}: {
  chat_id: number;
  _pageService: TPageService;
}) => {
  return (
    <>
      <Head>
        <title>AuditList | Online</title>
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
      </Head>
      {
        _pageService.isOk
        ? (
          <ResponsiveBlock
            isLimited
            // style={{ paddingBottom: '30px' }}
          >
            <Todo2023Online room={chat_id} />
          </ResponsiveBlock>
        ) : <ErrorPage message={_pageService.message || 'ERR: No _pageService.message'} />
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
