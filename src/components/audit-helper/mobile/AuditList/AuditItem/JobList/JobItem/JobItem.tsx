import { IJob, stateHelper, EJobStatus } from "~/components/audit-helper"
import { SubjobList } from './SubjobList'
import {
  Badge,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
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
// import CloseIcon from '@mui/icons-material/Close'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSelector } from "react-redux"
import { IRootState } from "~/store/IRootState"

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
  //-- NOTE: Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpened = Boolean(anchorEl);
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, [])
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, [])
  // --

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
    handleMenuClose()
  }, [auditId, job.id])

  const [isOpened, setIsOpened] = useState(false)

  const handleOpenToggle = useCallback(() => {
    setIsOpened((val) => !val)
  }, [setIsOpened])

  const handleRemoveJob = useCallback(() => {
    onRemoveJob({ auditId, jobId: job.id })
    handleMenuClose()
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

  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const iconColor = useMemo(() => {
    switch (currentTheme) {
      case 'dark':
      case 'hard-gray':
        return '#fff'
      case 'gray':
        return '#683434'
      case 'light':
      default: return 'inherit'
    }
  }, [currentTheme])

  return (
    <div
      style={{
        // NOTE: job header + subjobs
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      className='desktop-job-box'
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          // flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
          paddingLeft: '16px',
        }}
        className='desktop-sticky-top-job-header'
      >
        <Badge  color='error' badgeContent={incompleteSubjobsCounter}>
          {Icon}
        </Badge>
        <div style={{ fontFamily: 'system-ui' }}>{job.name}</div>
        <div
          style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row' }}
        >
          {
            job.subjobs.length > 0 && (
              <IconButton aria-label="open" onClick={handleOpenToggle}>
                {isOpened ? <ExpandLessIcon htmlColor={iconColor} /> : <ExpandMoreIcon htmlColor={iconColor} />}
              </IconButton>
            )
          }
          {/*
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
          */}
          {
            isEditable && (
              <>
                <IconButton
                  aria-label="more"
                  id="long-job-button"
                  aria-controls={isMenuOpened ? 'long-job-menu' : undefined}
                  aria-expanded={isMenuOpened ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <MoreVertIcon htmlColor={iconColor} />
                </IconButton>
                <Menu
                  id="long-job-menu"
                  MenuListProps={{
                    'aria-labelledby': 'long-job-button',
                  }}
                  anchorEl={anchorEl}
                  open={isMenuOpened}
                  onClose={handleMenuClose}
                  PaperProps={{
                    // style: {
                    //   maxHeight: ITEM_HEIGHT * 4.5,
                    //   width: '20ch',
                    // },
                  }}
                >
                  <MenuItem
                    selected={false}
                    onClick={handleDoneJob}
                  >
                    <ListItemIcon>{job.status === EJobStatus.IS_DONE ? <AutorenewIcon /> : <TaskAltIcon />}</ListItemIcon>
                    <Typography variant="inherit">{job.status === EJobStatus.IS_DONE ? 'Undone' : 'Done'}</Typography>
                  </MenuItem>

                  <MenuItem
                    selected={false}
                    onClick={handleRemoveJob}
                  >
                    <ListItemIcon><DeleteIcon fontSize="small" color='error' /></ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                  </MenuItem>
                </Menu>
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
