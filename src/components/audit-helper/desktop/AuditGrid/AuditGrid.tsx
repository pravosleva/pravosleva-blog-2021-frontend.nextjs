import { AuditGridItem } from './components'
import { TAudit, TSubJob, AddNewBtn } from '~/components/audit-helper'
import { useStyles } from './styles'
import {
  Alert,
  Typography,
} from '@mui/material'
import { WithStateContext } from './WithStateContext'
import { ActiveAuditJobList } from './components/ActiveAuditJobList'
import { useMemo } from 'react'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
import clsx from 'clsx'

export type TAuditListProps = {
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

  onAddNewAudit: ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => void;
  isInitAppInProgress?: boolean;
}

export const AuditGrid = ({
  audits,
  onRemoveAudit,
  onAddJob,
  onAddSubjob,
  onToggleJobDone,
  onRemoveJob,
  onToggleSubjob,
  onUpdateAuditComment,
  onAddNewAudit,

  isEditable,
  isInitAppInProgress,
}: TAuditListProps) => {
  const styles = useStyles()
  const isServer = useMemo(() => typeof window === 'undefined', [typeof window])

  if (isServer) return <CircularIndeterminate />

  return (
    <WithStateContext>
      <div className={styles.wrapper}>
        <div className={clsx(styles.leftSideWrapper)}>
          {
            isEditable ? (
              <div
                className={clsx(
                  styles.stickyTopPanel,
                  'backdrop-blur--lite',
                )}
                style={{
                  // height: '50px',
                  // display: 'flex',
                  // alignItems: 'center',
                  padding: '52px 0 8px 0',
                  // border: '1px solid red',
                }}
              >
                <AddNewBtn
                  cb={{
                    onSuccess: onAddNewAudit,
                    onError: (err) => {
                      console.log(err)
                    },
                  }}
                  label='Добавить Аудит'
                  muiColor='primary'
                  cfg={{
                    name: {
                      type: 'text',
                      label: 'Название',
                      inputId: 'audit-name',
                      placeholder: 'Аудит',
                      defaultValue: '',
                      reactHookFormOptions: { required: true, maxLength: 20, minLength: 3 }
                    },
                    description: {
                      type: 'text',
                      label: 'Описание',
                      inputId: 'audit-description',
                      placeholder: 'Something',
                      defaultValue: '',
                      reactHookFormOptions: { required: false, maxLength: 50 }
                    }
                  }}
                  isDisabled={isInitAppInProgress}
                />
              </div>
            ) : (
              <div
                className={clsx(
                  styles.stickyTopPanel,
                  'backdrop-blur--lite',
                )}
                style={{
                  // height: '50px',
                  // display: 'flex',
                  // alignItems: 'center',
                  padding: '45px 0 8px 0',
                  // border: '1px solid red',
                }}
              />
            )
          }
          <div className={clsx(styles.auditListWrapper)}>
            {
              !isInitAppInProgress
              ? audits.length > 0 ? (
                  <>
                    {
                      audits.map((audit) => (
                        <div className={styles.auditItem} key={audit.id}>
                          <AuditGridItem
                            audit={audit}
                            isEditable={isEditable}
                            onRemoveAudit={onRemoveAudit}
                          />
                        </div>
                      ))
                    }
                  </>
                ) : (
                  <Alert
                    // sx={{ mb: 2 }}
                    variant="standard"
                    severity="info"
                  >
                    <Typography variant="body2" component="h2" gutterBottom>
                      Еще ничего не создано
                    </Typography>
                  </Alert>
                )
              : <CircularIndeterminate />
            }
          </div>
        </div>
        <div className={styles.rightSideWrapper}>
          
          <ActiveAuditJobList
            audits={audits}
            onAddJob={onAddJob}
            onAddSubjob={onAddSubjob}

            onToggleJobDone={onToggleJobDone}
            onRemoveJob={onRemoveJob}
            onToggleSubjob={onToggleSubjob}
            onUpdateAuditComment={onUpdateAuditComment}

            isEditable={isEditable}
          />
        </div>
      </div>
    </WithStateContext>
  )
}
