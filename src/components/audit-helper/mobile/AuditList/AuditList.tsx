// import { TAudit, stateInstance } from '~/components/ToDo2023/state'
import { AuditItem } from './AuditItem'
// import { IRootState } from '~/store/IRootState'
import { memo } from 'react'
import { Alert, Typography } from '@mui/material'
import { TAudit, TSubJob } from '~/components/audit-helper'
import { useMemo } from 'react'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'

type TAuditListProps = {
  audits: TAudit[];
  onUpdateAuditComment: ({
    auditId,
    comment,
  }: {
    auditId: string;
    comment: string;
  }) => void;
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
  isEditable: boolean;
  isInitAppInProgress?: boolean;
}

export const AuditList = memo(({
  audits,
  onUpdateAuditComment,
  onRemoveAudit,
  onAddJob,
  onAddSubjob,
  onToggleJobDone,
  onRemoveJob,
  onToggleSubjob,
  isEditable,
  isInitAppInProgress,
}: TAuditListProps) => {
  const isServer = useMemo(() => typeof window === 'undefined', [typeof window])

  if (isServer) return <CircularIndeterminate />

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        gap: '0px',

        // border: '1px solid red',
        // paddingBottom: '16px',
      }}
    >
      {
        !isInitAppInProgress
        ? audits.length > 0 ? (
          audits.map((audit) => (
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
              isEditable={isEditable}
              onUpdateAuditComment={onUpdateAuditComment}
            />
          ))) : (
            <Alert
              // sx={{ mb: 2 }}
              variant="standard"
              severity="info"
            >
              <Typography variant="body2" component="h2" gutterBottom>
                Список пуст
              </Typography>
            </Alert>
          )
        : (
          <CircularIndeterminate />
        )
      }
    </div>
  )
})
