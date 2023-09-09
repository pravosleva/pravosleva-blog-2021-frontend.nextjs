import { TAudit } from "~/components/ToDo2023/state"
import { JobList } from './JobList'
import { stateInstance } from '~/components/ToDo2023/state'
import Badge from "@mui/material/Badge";
// import SettingsIcon from '@mui/icons-material/Settings';
import { useCallback, useState } from "react";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from "@mui/material/IconButton";
// import ReportIcon from '@mui/icons-material/Report';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Typography from "@mui/material/Typography";

type TProps = {
  audit: TAudit;
}

export const AuditItem = ({ audit }: TProps) => {
  const [isOpened, setIsOpened] = useState(false)

  const handleToggle = useCallback(() => {
    setIsOpened((val) => !val)
  }, [setIsOpened])

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
        <Badge color="error" badgeContent={stateInstance.getIncompleteJobsCounter({
          auditId: audit.id,
        })}>
          {stateInstance.getIncompleteJobsCounter({ auditId: audit.id }) > 0 ? <FolderIcon /> : <TaskAltIcon color='success' />}
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
            <IconButton color='error' aria-label="delete" onClick={() => {
              const isConfirmed = window.confirm('Вы уверены?')
              if (isConfirmed) stateInstance.removeAudit({
                auditId: audit.id,
              })}}
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
            jobs={audit.jobs}
          />
        )
      }
    </div>
  )
}
