import { useCallback } from 'react'
import { CircularWithValueLabel } from '~/components/CircularWithValueLabel'
import { useStyles } from './styles'
import { useMemo } from 'react'
import { TAudit, stateHelper } from '~/components/audit-helper'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import { IconButton } from '@mui/material'
import { useStore, TDesktopAuditState } from '~/components/audit-helper/desktop/AuditGrid/WithStateContext'
import clsx from 'clsx'

type TProps = {
  audit: TAudit;
  // onUpdateAuditComment: (ps: {
  //   auditId: string;
  //   comment: string;
  // }) => void;
  onRemoveAudit: (ps: {
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
  // onToggleJobDone: (ps: {
  //   auditId: string;
  //   jobId: string;
  // }) => void;
  // onRemoveJob: (ps: {
  //   auditId: string;
  //   jobId: string;
  // }) => void;
  // onToggleSubjob: (ps: {
  //   auditId: string;
  //   jobId: string;
  //   subjobId: string;
  // }) => void;
  onEditAudit?: (audit: TAudit) => void;
  isEditable: boolean;
}
export const AuditGridItem = ({ audit, isEditable, onRemoveAudit, onEditAudit }: TProps) => {
  const styles = useStyles()
  const completeJobsPercentage = useMemo(() => stateHelper.getCompleteJobsPercentage({
    audit,
  }).value, [audit.tsUpdate])

  const [activeAuditId, setStore] = useStore((store: TDesktopAuditState) => store.activeAuditId)
  const handleSelectAuditAsActive = useCallback(({ auditId }: { auditId: string }) => (_ev: any) => {
      setStore({ activeAuditId: auditId })
  }, [])
  const isAuditActive = useMemo<boolean>(() => activeAuditId === audit.id, [activeAuditId])

  return (
    <div className={clsx(styles.wrapper, { [styles.activeWrapper]: isAuditActive })}>
      <div className={styles.display}>
        <div className={styles.circleBox}>
          <CircularWithValueLabel progressValue={completeJobsPercentage} />
        </div>
        <div className={styles.displayTitle}>
          <div className={styles.name}>{audit.name}</div>
          <div className={styles.description}>{audit.description}</div>
        </div>
      </div>
      <div className={styles.actions}>
        {
          isEditable && !!onEditAudit && (
            <IconButton
              color='default'
              aria-label='edit-audit'
              onClick={() => onEditAudit(audit)}
            >
              <DriveFileRenameOutlineIcon />
            </IconButton>
          )
        }
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
      </div>
    </div>
  )
}
