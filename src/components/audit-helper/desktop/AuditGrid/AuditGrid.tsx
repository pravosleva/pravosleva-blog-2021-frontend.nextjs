import { AuditGridItem } from './components'
import { TAudit, TSubJob, AddNewBtn } from '~/components/audit-helper'
import { useStyles } from './styles'
import {
  Alert,
  Box,
  Typography,
} from '@mui/material'
import { WithStateContext } from './WithStateContext'
import { ActiveAuditJobList } from './components/ActiveAuditJobList'

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
}: TAuditListProps) => {
  const classes = useStyles()

  return (
    <WithStateContext>
      <div className={classes.wrapper}>
        <div className={classes.leftSideWrapper}>
          {
            isEditable ? (
              <Box sx={{ pt:0, pb: 1 }}>
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
                />
              </Box>
            ) : null
          }
          {
            audits.length > 0 ? (
              audits.map((audit) => (
                <div className={classes.auditItem}>
                  <AuditGridItem
                    audit={audit}
                    isEditable={isEditable}
                    onRemoveAudit={onRemoveAudit}
                  />
                </div>
              ))
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
          }
        </div>
        <div className={classes.rightSideWrapper}>
          
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
