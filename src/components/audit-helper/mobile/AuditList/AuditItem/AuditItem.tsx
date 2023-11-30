import { TAudit, TSubJob, stateHelper } from "~/components/audit-helper"
import { JobList } from './JobList'
// import Badge from "@mui/material/Badge"
// import SettingsIcon from '@mui/icons-material/Settings'
import { useCallback, useState, useMemo, memo } from "react"
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from "@mui/material/IconButton"
// import ReportIcon from '@mui/icons-material/Report'
// import FolderIcon from '@mui/icons-material/Folder'
import DeleteIcon from '@mui/icons-material/Delete'
// import TaskAltIcon from '@mui/icons-material/TaskAlt'
import {
  Typography,
} from '@mui/material'
import { CircularWithValueLabel } from '~/components/CircularWithValueLabel'
import { CommentBtn } from '~/components/audit-helper/common/CommentBtn'

type TProps = {
  audit: TAudit;
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
}

export const AuditItem = memo(({ audit, onUpdateAuditComment, onRemoveAudit, onAddJob, onAddSubjob, onToggleJobDone, onRemoveJob, onToggleSubjob, isEditable }: TProps) => {
  const [isOpened, setIsOpened] = useState(false)

  const handleToggle = useCallback(() => {
    setIsOpened((val) => !val)
  }, [setIsOpened])

  // const incompleteJobsCounter = useMemo<number>(() => stateHelper.getIncompleteJobsCounter({
  //   audit,
  // }), [audit.tsUpdate])
  const completeJobsPercentage = useMemo(() => stateHelper.getCompleteJobsPercentage({
    audit,
  }).value, [audit.tsUpdate])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        gap: '0px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'center',
          gap: '8px',

          position: 'sticky',
          top: '0px',
          backgroundColor: '#fff',
          zIndex: 2,
          borderBottom: '1px solid lightgray',

          paddingTop: '16px',
          paddingBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '16px',

            // backgroundColor: 'rgba(255,255,255,0.5)',
            // paddingLeft: '16px',
            // paddingRight: '16px',
          }}
          // className='backdrop-blur--lite'
        >
          {/* <Badge
            color="error"
            badgeContent={incompleteJobsCounter}
          >
            {incompleteJobsCounter > 0 ? <FolderIcon /> : <TaskAltIcon color='success' />}
          </Badge> */}
          <div
            style={{
              display: 'flex',
              // justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularWithValueLabel progressValue={completeJobsPercentage} />
          </div>

          <div style={{ fontWeight: 'bold' }}>{audit.name}</div>
          
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row' }}>
            <>
              {
                audit.jobs.length > 0 && (
                  <IconButton aria-label="delete" onClick={handleToggle}>
                    {isOpened ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                )
              }
              {
                isEditable && (
                  <IconButton
                    color='error'
                    aria-label="delete-audit"
                    onClick={() => {
                      onRemoveAudit({ auditId: audit.id })
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            </>
          </div>
        </div>
        {
          !!audit.description && (
            <Typography
              variant="caption"
              display="block"
              gutterBottom
              sx={{ mb: 0 }}
            >
              {audit.description}
            </Typography>
          )
        }
        <CommentBtn
          key={`comment-${audit.comment}`}
          initialState={{
            comment: audit.comment || '',
          }}
          onSuccess={({ state }) => {
            console.log(state)
            onUpdateAuditComment({
              auditId: audit.id,
              comment: state.comment,
            })
          }}
          isEditable={isEditable}
        />
      </div>
      {
        audit.jobs.length > 0 && isOpened && (
          <JobList
            auditId={audit.id}
            auditTsUpdate={audit.tsUpdate}
            jobs={audit.jobs}

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
}, function arePropsEqual(prevPs, nextPs) {
  return (
    prevPs.audit.tsUpdate === nextPs.audit.tsUpdate
    && prevPs.isEditable === nextPs.isEditable
    && prevPs.audit.comment === nextPs.audit.comment
  )
})
