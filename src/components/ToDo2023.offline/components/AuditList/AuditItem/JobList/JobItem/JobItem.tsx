import { IJob, stateHelper, EJobStatus } from "~/components/ToDo2023.offline/state"
import { SubjobList } from './SubjobList'
import Badge from '@mui/material/Badge'
// import MailIcon from '@mui/icons-material/Mail'
// import DoneIcon from '@mui/icons-material/Done'
// import Button from "@mui/material/Button"
// import { useSnapshot } from 'valtio'
// import { useEffect, useMemo } from "react"
// import { useSnapshot } from 'valtio'
// import SettingsIcon from '@mui/icons-material/Settings'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import IconButton from '@mui/material/IconButton'
// import Stack from '@mui/material/Stack'
// import DeleteIcon from '@mui/icons-material/Delete'
// import AlarmIcon from '@mui/icons-material/Alarm'
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { memo, useCallback, useMemo, useState } from "react"
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ReportIcon from '@mui/icons-material/Report'
import CloseIcon from '@mui/icons-material/Close'

type TProps = {
  job: IJob;
  auditId: string;
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

// const statusDict: {
//   [key in EJobStatus]: string;
// } = {
//   [EJobStatus.IN_PROGRESS]: 'В процессе',
//   [EJobStatus.IS_DONE]: 'Завершено',
//   [EJobStatus.IS_NOT_AVAILABLE]: 'Отключено',
// }

export const JobItem = memo(({
  job,
  auditId,
  onToggleJobDone,
  onRemoveJob,
  onToggleSubjob,
  isEditable,
}: TProps) => {
  // const audits = useSnapshot<TAudit[]>(stateHelper.state.audits)
  // useEffect(() => {
  //   console.log(`${auditId} ${job.id} -> ${counter}`)
  // }, [counter])
  const handleDoneJob = useCallback(() => {
    // stateHelper.toggleJobDone({
    //   auditId,
    //   jobId: job.id,
    // })
    onToggleJobDone({ auditId, jobId: job.id })
  }, [auditId, job.id])

  const [isOpened, setIsOpened] = useState(false)

  const handleOpenToggle = useCallback(() => {
    setIsOpened((val) => !val)
  }, [setIsOpened])

  const handleRemoveJob = useCallback(() => {
    onRemoveJob({ auditId, jobId: job.id })
  }, [auditId, job.id])

  const incompleteSubjobsCounter = useMemo(() => {
    return stateHelper.getIncompleteSubjobsCounter({
      job,
    })
  }, [job.tsUpdate])
  const Icon = useMemo(() => {
    switch (job.status) {
      case EJobStatus.IS_DONE: return <TaskAltIcon color='success' />
      default: return <ReportIcon />
    }
  }, [job.status, job.tsUpdate])
  
  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <Badge  color='error' badgeContent={incompleteSubjobsCounter}>
          {Icon}
        </Badge>
        <div>{job.name}</div>
        <div
          style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row' }}
        >
          {
            job.subjobs.length > 0 && (
              <IconButton aria-label="open" onClick={handleOpenToggle}>
                {isOpened ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )
          }
          {
            isEditable && (
              <>
                <IconButton aria-label="remove-job" onClick={handleRemoveJob}>
                  <CloseIcon color="error" />
                </IconButton>
                <IconButton aria-label="done" onClick={handleDoneJob}>
                  {job.status === EJobStatus.IS_DONE ? <AutorenewIcon /> : <TaskAltIcon />}
                </IconButton>
              </>
            )
          }
        </div>
      </div>

      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          opacity: job.status === EJobStatus.IS_DONE ? 0.5 : 1,
        }}
      >
        {
          job.subjobs.length > 0 && (
            <SubjobList subjobs={job.subjobs} auditId={auditId} jobId={job.id} />
          )
        }
      </div> */}
      {
        job.subjobs.length > 0 && isOpened && (
          <SubjobList
            subjobs={job.subjobs}
            auditId={auditId}
            jobId={job.id}
            jobTsUpdate={job.tsUpdate}
            onToggleSubjob={onToggleSubjob}
            isEditable={isEditable}
          />
        )
      }
    </div>
  )
}, (prevPs, nextPs) => prevPs.job.tsUpdate === nextPs.job.tsUpdate && prevPs.job.status === nextPs.job.status && prevPs.isEditable === nextPs.isEditable)
