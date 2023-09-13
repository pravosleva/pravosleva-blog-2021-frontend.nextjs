import { TSubJob, ESubjobStatus } from "~/components/ToDo2023/state"
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
// import TagFacesIcon from '@mui/icons-material/TagFaces';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WhatshotIcon from '@mui/icons-material/Whatshot';
// import { stateInstance } from '~/components/ToDo2023/state'
import DoneIcon from '@mui/icons-material/Done';
import { memo, useCallback } from "react"

type TProps = {
  subjobs: TSubJob[];
  auditId: string;
  jobId: string;
  jobTsUpdate: number;
  onToggleSubjob: ({
    auditId,
    jobId,
    subjobId,
  }: {
    auditId: string;
    jobId: string;
    subjobId: string;
  }) => void;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));
const icons: {
  [key in ESubjobStatus]: {
    component: any;
    muiSettings: {
      color: 'primary' | 'success' | 'error' | undefined;
      variant: 'outlined' | 'filled';
    };
  }
} = {
  [ESubjobStatus.IN_PROGRESS]: {
    component: <WhatshotIcon />,
    muiSettings: {
      color: 'error',
      variant: 'outlined',
    },
  },
  [ESubjobStatus.IS_DONE]: {
    component: <DoneIcon />,
    muiSettings: {
      color: 'success',
      variant: 'outlined',
    },
  },
}

export const SubjobList = memo(({ subjobs, auditId, jobId, onToggleSubjob }: TProps) => {
  const handleToggleSubjob = useCallback(({ subjobId }: { subjobId: string; }) => {
    onToggleSubjob({
      auditId,
      jobId,
      subjobId,
    })
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          // flexDirection: 'column',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          listStyle: 'none',
          boxShadow: 'none',
          // p: 0.5,
          m: 0,
          p: 0,
          overflowX: 'auto',
        }}
        component="ul"
      >
        {
          subjobs.map(({ id, status, tsUpdate, name }) => (
            <ListItem key={`${auditId}-${jobId}-${id}-${tsUpdate}-${status}`}>
              <Chip
                icon={icons[status]?.component || <HelpOutlineIcon />}
                label={name}
                color={icons[status]?.muiSettings.color || undefined}
                variant={icons[status]?.muiSettings.variant || undefined}
                // onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                onClick={() => {
                  handleToggleSubjob({ subjobId: id })
                }}
              />
            </ListItem>
          ))
        }
      </Paper>
    </div>
  )
}, (prevPs, nextPs) => prevPs.jobTsUpdate === nextPs.jobTsUpdate)
