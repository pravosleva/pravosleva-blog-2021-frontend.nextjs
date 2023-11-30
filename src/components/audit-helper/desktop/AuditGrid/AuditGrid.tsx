import { AuditGridItem } from './components'
import { TAudit, TSubJob, AddNewBtn } from '~/components/audit-helper'
import { useStyles } from './styles'
import { Alert } from '@mui/material'
import { WithStateContext } from './WithStateContext'
import { ActiveAuditJobList } from './components/ActiveAuditJobList'
import {
  useMemo,
  // useState, useCallback,
} from 'react'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
import clsx from 'clsx'
// import { AddAnythingNewDialog } from '~/components/Todo2023.online/components/TodoConnected/components'

export type TAuditListProps = {
  audits: TAudit[];
  onUpdateAuditComment: (ps: {
    auditId: string;
    comment: string;
  }) => void;
  onRemoveAudit: (ps: {
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
  onToggleJobDone: (ps: {
    auditId: string;
    jobId: string;
  }) => void;
  onRemoveJob: (ps: {
    auditId: string;
    jobId: string;
  }) => void;
  onToggleSubjob: (ps: {
    auditId: string;
    jobId: string;
    subjobId: string;
  }) => void;
  isEditable: boolean;
  onAddNewAudit: (ps: {
    name: string;
    description: string;
  }) => void;
  onOpenEditAuditDialog?: (audit: TAudit) => void;
  // auditValidator?: (ps: {
  //   auditId: string;
  //   name: string;
  //   description?: string;
  // }) => {
  //   ok: boolean;
  //   reason?: string;
  // }

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
  onOpenEditAuditDialog,
  // auditValidator,

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
                  padding: '52px 0 16px 0',
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
                            onEditAudit={onOpenEditAuditDialog}
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
                    Список пуст
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
