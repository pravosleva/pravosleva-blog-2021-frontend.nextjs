import { AuditListIntroSvg } from "~/components/special-svg-content/projects/audit-list/AuditListIntroSvg.v2"
import { ReactiveEngineIntroSvg } from "~/components/special-svg-content/projects/reactive-engine/_tmp"
import { RetroDiceIntroSvg } from "~/components/special-svg-content/projects/retro-dice/RetroDiceIntroSvg.v4"
import { OnlineTradeinIntroSvg } from "~/components/special-svg-content/projects/tradein/OnlineTradeinIntroSvg"

interface IProps {
  contentCode: 'reactive-engine' | 'retro-dice' | 'audit-list' | 'online-tradein'
}

export const FullWidthSection = ({ contentCode }: IProps) => {
  switch (contentCode) {
    case 'reactive-engine':
      return (
        <div
          style={{ width: '100%', marginBottom: '1.45rem' }}
        >
          <ReactiveEngineIntroSvg />
        </div>
      )
    case 'retro-dice':
      return (
        <div
          style={{ width: '100%', marginBottom: '1.45rem' }}
        >
          <RetroDiceIntroSvg />
        </div>
      )
    case 'audit-list':
      return (
        <div
          style={{ width: '100%', marginBottom: '1.45rem' }}
        >
          <AuditListIntroSvg />
        </div>
        
      )
    case 'online-tradein':
      return (
        <div
          style={{ width: '100%', marginBottom: '1.45rem' }}
        >
          <OnlineTradeinIntroSvg />
        </div>
        
      )
    default: return null
  }
}
