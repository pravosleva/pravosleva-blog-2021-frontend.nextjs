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
// import { useSelector } from 'react-redux'
// import { IRootState } from '~/store/IRootState'

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
  const handleSelectAuditAsActive = useCallback(({ auditId }: { auditId: string | null }) => (_ev: any) => {
      setStore({ activeAuditId: auditId })
  }, [])
  const isAuditActive = useMemo<boolean>(() => activeAuditId === audit.id, [activeAuditId])
  
  return (
    <div className={clsx(styles.wrapper, { [styles.activeWrapper]: isAuditActive })}>
      <div className={styles.display}>
        <div className={styles.circleBox}>
          <CircularWithValueLabel
            progressValue={completeJobsPercentage}
          />
        </div>
        <div className={styles.displayTitle}>
          <div className={styles.name}>{audit.name}</div>
          <div className={styles.description}>{audit.description}</div>
        </div>
      </div>
      <div className={styles.actions}>
        {
          isAuditActive && (
            <>
              {
                isEditable && !!onEditAudit && (
                  <IconButton
                    color={isAuditActive ? 'success' : 'default'}
                    aria-label='edit-audit'
                    onClick={() => onEditAudit(audit)}
                  >
                    <DriveFileRenameOutlineIcon />
                  </IconButton>
                )
              }
              {
                isEditable && (
                  <IconButton
                    color={isAuditActive ? 'error' : 'default'}
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
            </>
          )
        }
        <IconButton
          // color={isAuditActive ? 'info' : 'default'}
          color='info'
          aria-label="select-audit"
          onClick={handleSelectAuditAsActive({ auditId: isAuditActive ? null : audit.id })}
        >
          <DoubleArrowIcon />
        </IconButton>
      </div>
    </div>
  )
}
