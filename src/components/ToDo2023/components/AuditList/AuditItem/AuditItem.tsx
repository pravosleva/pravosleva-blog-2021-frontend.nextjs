import { TAudit } from "~/components/ToDo2023/state"
import { JobList } from './JobList'
import { stateHelper } from '~/components/ToDo2023/state'
import Badge from "@mui/material/Badge";
// import SettingsIcon from '@mui/icons-material/Settings';
import { useCallback, useState, useMemo, memo } from "react";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from "@mui/material/IconButton";
// import ReportIcon from '@mui/icons-material/Report';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Typography from "@mui/material/Typography";
import { useDispatch } from 'react-redux'
import { removeAudit } from "~/store/reducers/todo2023";

type TProps = {
  audit: TAudit;
}

export const AuditItem = memo(({ audit }: TProps) => {
  const dispatch = useDispatch()
  const [isOpened, setIsOpened] = useState(false)

  const handleToggle = useCallback(() => {
    setIsOpened((val) => !val)
  }, [setIsOpened])

  const incompleteJobsCounter = useMemo<number>(() => {
    return stateHelper.getIncompleteJobsCounter({
      audit,
    })
  }, [audit.tsUpdate])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px',

          position: 'sticky',
          top: '0px',
          backgroundColor: '#fff',
          zIndex: 2,
          borderBottom: '1px solid lightgray',
        }}
      >
        <Badge
          color="error"
          badgeContent={incompleteJobsCounter}
        >
          {incompleteJobsCounter > 0 ? <FolderIcon /> : <TaskAltIcon color='success' />}
        </Badge>

        <div>{audit.name}</div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row' }}>
          <>
            {
              audit.jobs.length > 0 && (
                <IconButton aria-label="delete" onClick={handleToggle}>
                  {isOpened ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )
            }
            <IconButton
              color='error'
              aria-label="delete"
              onClick={() => {
                const isConfirmed = window.confirm('Вы уверены?')
                if (isConfirmed) dispatch(removeAudit({
                  auditId: audit.id,
                }))
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        </div>
      </div>
      {
        !!audit.description && (
          <Typography variant="caption" display="block" gutterBottom sx={{ mb: 0 }}>
            {audit.description}
          </Typography>
        )
      }
      {
        audit.jobs.length > 0 && isOpened && (
          <JobList
            auditId={audit.id}
            auditTsUpdate={audit.tsUpdate}
            jobs={audit.jobs}
          />
        )
      }
    </div>
  )
}, function arePropsEqual(prevPs, nextPs) {
  return prevPs.audit.tsUpdate === nextPs.audit.tsUpdate
})
