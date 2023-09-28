import { useMemo } from 'react'
import { JobList } from '~/components/audit-helper/mobile/AuditList/AuditItem/JobList'
import { useStore, TDesktopAuditState } from '~/components/audit-helper/desktop/AuditGrid/WithStateContext'
import { TAudit, TSubJob, IJob } from '~/components/audit-helper'
import { useCompare } from '~/hooks/useDeepEffect'
import { CommentBtn } from '~/components/audit-helper/common/CommentBtn'
// import { Stack } from '@mui/material'

type TProps = {
  audits: TAudit[];
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
  onUpdateAuditComment: ({
    auditId,
    comment,
  }: {
    auditId: string;
    comment: string;
  }) => void;
  isEditable: boolean;
}


export const ActiveAuditJobList = ({ audits, onUpdateAuditComment, onAddJob, onAddSubjob, onToggleJobDone, onRemoveJob, onToggleSubjob, isEditable }: TProps) => {
  const [activeAuditId, _setStore] = useStore((store: TDesktopAuditState) => store.activeAuditId)
  const targetJobs = useMemo<IJob[]>(() => {
    try {
      const targetAuditIndex = audits.findIndex(({ id }) => id === activeAuditId)
      if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')

      return audits[targetAuditIndex].jobs
    } catch (err) {
      console.warn(err)
      return []
    }
  }, [activeAuditId, useCompare([audits])])
  const auditTsUpdate = useMemo<number>(() => {
    try {
      const targetAuditIndex = audits.findIndex(({ id }) => id === activeAuditId)
      if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')

      return audits[targetAuditIndex].tsUpdate
    } catch (err) {
      console.warn(err)
      return 0
    }
  }, [activeAuditId, useCompare([audits])])
  const activeAuditComment = useMemo<string>(() => {
    try {
      const targetAuditIndex = audits.findIndex(({ id }) => id === activeAuditId)
      if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')

      return audits[targetAuditIndex].comment || ''
    } catch (err) {
      console.warn(err)
      return ''
    }
  }, [activeAuditId, useCompare([audits])])

  switch (true) {
    case !!activeAuditId:
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
          }}
        >
          <CommentBtn
            key={activeAuditComment}
            initialState={{
              comment: activeAuditComment || '',
            }}
            onSuccess={({ state }) => {
              // console.log(state)
              if (!!activeAuditId) onUpdateAuditComment({
                auditId: activeAuditId,
                comment: state.comment,
              })
            }}
          />
          {
            !!activeAuditId && (
              <JobList
                jobs={targetJobs}
                auditId={activeAuditId}
                auditTsUpdate={auditTsUpdate}
                onAddJob={onAddJob}
                onAddSubjob={onAddSubjob}
                onToggleJobDone={onToggleJobDone}
                onRemoveJob={onRemoveJob}
                onToggleSubjob={onToggleSubjob}

                isEditable={isEditable}
              />
            )
          }
        </div>
      )
    default: return null
  }
}
