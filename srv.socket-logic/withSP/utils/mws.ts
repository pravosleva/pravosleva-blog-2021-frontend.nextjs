import { clientAppVersionlistSupport } from '~/srv.socket-logic/withSP/constants'
import { testTextByAnyWord } from '~/srv.utils/tools-string/testTextByAnyWorld'
import { NEvent } from '~/srv.socket-logic/withSP/types'

export const mws = {
  checkAppVersion({ data }: {
    data: NEvent.TReport | undefined;
  }): Promise<{
    ok: boolean;
    reason?: string;
    _info?: any;
  }> {
    if (
      !data?.appVersion
      // || !clientAppVersionlistSupport.includes(data.appVersion)
      || !testTextByAnyWord({ text: data.appVersion, words: clientAppVersionlistSupport })
    )
      return Promise.reject({
        ok: false,
        reason: 'Your appVersion not supported',
        _info: {
          supportedVersions: clientAppVersionlistSupport
        },
      })

    return Promise.resolve({ ok: true })
  }
}