import { clientAppVersionlistSupport } from '~/srv.socket-logic/withReactiveChat/constants'
import { testTextByAnyWord } from '~/srv.utils/tools-string/testTextByAnyWorld'
import { NEvent } from '~/srv.socket-logic/withReactiveChat/types'

export const mws = {
  checkAppVersion({ data }: {
    data: Pick<NEvent.TReport, 'app'> | undefined;
  }): Promise<{
    ok: boolean;
    reason?: string;
    _info?: any;
  }> {
    if (
      !data?.app?.version
      || !data?.app?.name
      // || !clientAppVersionlistSupport.includes(data.appVersion)
      || !testTextByAnyWord({
        text: `${data.app.name}@${data.app.version}`,
        words: clientAppVersionlistSupport,
      })
    )
      return Promise.reject({
        ok: false,
        reason: [
          `Your app name@version`,
          `[${data?.app?.name || typeof data?.app?.name}@${data?.app?.version || typeof data?.app?.version}]`,
          'not supported',
        ].join(' '),
        _info: {
          supportedVersions: clientAppVersionlistSupport
        },
      })
    return Promise.resolve({ ok: true })
  }
}
