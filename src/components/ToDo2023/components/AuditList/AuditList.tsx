// import { TAudit, stateInstance } from '~/components/ToDo2023/state'
// import { useSnapshot } from 'valtio';
// import { useSelector } from 'react-redux'
import { AuditItem } from './AuditItem'
// import { IRootState } from '~/store/IRootState'
import { memo } from 'react'
import { TAudit } from '../../state'

export const AuditList = memo(({ audits }: { audits: TAudit[] }) => {
  // const audits = useSnapshot<TAudit[]>(stateInstance.state.audits)
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        gap: '8px',
      }}
    >
      {audits.map((audit) => (
        <AuditItem
          // @ts-ignore
          audit={audit}
          key={audit.id}
        />
      ))}
    </div>
  )
})
