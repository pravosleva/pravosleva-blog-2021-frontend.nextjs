import { TAudit, stateInstance } from '~/components/ToDo2023/state'
import { useSnapshot } from 'valtio';
import { AuditItem } from './AuditItem'

export const AuditList = () => {
  const audits = useSnapshot<TAudit[]>(stateInstance.state.audits)

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
}
