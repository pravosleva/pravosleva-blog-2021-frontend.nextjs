// import { TAudit, stateInstance } from '~/components/ToDo2023/state'
import { AuditItem } from './AuditItem'
// import { IRootState } from '~/store/IRootState'
import { memo } from 'react'
import { TAudit, TSubJob } from '../../state'

type TProps = {
  audits: TAudit[];
  onRemoveAudit: ({
    auditId
  }: {
    auditId: string;
  }) => void;
  onAddJob: (ps: {
    auditId: string;
    name: string;
    subjobs: TSubJob[];
  }) => void;
  onAddSubjob: (ps: {
    name: string;
    auditId: string;
    jobId: string;
  }) => void;
  onToggleJobDone: ({
    auditId,
    jobId,
  }: {
    auditId: string;
    jobId: string;
  }) => void;
  onRemoveJob: ({
    auditId,
    jobId,
  }: {
    auditId: string;
    jobId: string;
  }) => void;
  onToggleSubjob: ({
    auditId,
    jobId,
    subjobId,
  }: {
    auditId: string;
    jobId: string;
    subjobId: string;
  }) => void;
}

export const AuditList = memo(({ audits, onRemoveAudit, onAddJob, onAddSubjob, onToggleJobDone, onRemoveJob, onToggleSubjob }: TProps) => {
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
          onRemoveAudit={onRemoveAudit}
          onAddJob={onAddJob}
          onAddSubjob={onAddSubjob}
          onToggleJobDone={onToggleJobDone}
          onRemoveJob={onRemoveJob}
          onToggleSubjob={onToggleSubjob}
        />
      ))}
    </div>
  )
})
