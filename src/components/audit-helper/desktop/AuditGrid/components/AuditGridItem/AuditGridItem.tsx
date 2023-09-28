import { useCallback } from 'react'
import { CircularWithValueLabel } from '~/components/CircularWithValueLabel'
import { useStyles } from './styles'
import { useMemo } from 'react'
import { TAudit, stateHelper } from '~/components/audit-helper'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import { useStore, TDesktopAuditState } from '~/components/audit-helper/desktop/AuditGrid/WithStateContext'
import clsx from 'clsx'

type TProps = {
  audit: TAudit;
  // onUpdateAuditComment: ({
  //   auditId,
  //   comment,
  // }: {
  //   auditId: string;
  //   comment: string;
  // }) => void;
  onRemoveAudit: ({
    auditId
  }: {
    auditId: string;
  }) => void;
  // onAddJob: (ps: {
  //   auditId: string;
  //   name: string;
  //   subjobs: TSubJob[];
  // }) => void;
  // onAddSubjob: (ps: {
  //   name: string;
  //   auditId: string;
  //   jobId: string;
  // }) => void;
  // onToggleJobDone: ({
  //   auditId,
  //   jobId,
  // }: {
  //   auditId: string;
  //   jobId: string;
  // }) => void;
  // onRemoveJob: ({
  //   auditId,
  //   jobId,
  // }: {
  //   auditId: string;
  //   jobId: string;
  // }) => void;
  // onToggleSubjob: ({
  //   auditId,
  //   jobId,
  //   subjobId,
  // }: {
  //   auditId: string;
  //   jobId: string;
  //   subjobId: string;
  // }) => void;
  isEditable: boolean;
}
export const AuditGridItem = ({ audit, isEditable, onRemoveAudit }: TProps) => {
  const classes = useStyles()
  const completeJobsPercentage = useMemo(() => stateHelper.getCompleteJobsPercentage({
    audit,
  }).value, [audit.tsUpdate])

  const [activeAuditId, setStore] = useStore((store: TDesktopAuditState) => store.activeAuditId)
  const handleSelectAuditAsActive = useCallback(({ auditId }: { auditId: string }) => (_ev: any) => {
      setStore({ activeAuditId: auditId })
  }, [])
  const isAuditActive = useMemo<boolean>(() => activeAuditId === audit.id, [activeAuditId])

  return (
    <div className={clsx(classes.wrapper, { [classes.activeWrapper]: isAuditActive })}>
      <div className={classes.display}>
        <div className={classes.circleBox}>
          <CircularWithValueLabel progressValue={completeJobsPercentage} />
        </div>
        <div className={classes.displayTitle}>
          <div className={classes.name}>{audit.name}</div>
          <div className={classes.description}>{audit.description}</div>
        </div>
      </div>
      <div className={classes.actions}>
        <IconButton
          color={isAuditActive ? 'info' : 'default'}
          aria-label="select-audit"
          onClick={handleSelectAuditAsActive({ auditId: audit.id })}
        >
          <DoubleArrowIcon />
        </IconButton>
        {
          isEditable && (
            <IconButton
              color='error'
              aria-label="delete-audit"
              onClick={() => {
                onRemoveAudit({ auditId: audit.id })
                if (activeAuditId === audit.id) setStore({ activeAuditId: null })
              }}
            >
              <DeleteIcon />
            </IconButton>
          )
        }
        {/* <div>del</div> */}
      </div>
    </div>
  )
}
