import { TSubJob, ESubjobStatus } from '~/components/audit-helper/types'
// import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import {
  Box,
  // Paper,
}from '@mui/material'
// import TagFacesIcon from '@mui/icons-material/TagFaces'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
// import TaskAltIcon from '@mui/icons-material/TaskAlt'
import WhatshotIcon from '@mui/icons-material/Whatshot'
// import { stateInstance } from '~/components/ToDo2023/state'
import DoneIcon from '@mui/icons-material/Done'
import { memo, useCallback } from 'react'
import { /* VariantType, */ useSnackbar } from 'notistack'

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
  isEditable: boolean;
}

// const ListItem = styled('li')(({ theme }) => ({
//   margin: theme.spacing(0.5),
// }));
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

export const SubjobList = memo(({ subjobs, auditId, jobId, onToggleSubjob, isEditable }: TProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const handleToggleSubjob = useCallback(({ subjobId }: { subjobId: string; }) => {
    if (!isEditable) {
      enqueueSnackbar('For authorized users only', { variant: 'error', autoHideDuration: 3000 })
      return
    }
    onToggleSubjob({
      auditId,
      jobId,
      subjobId,
    })
  }, [isEditable])
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
          
        // border: '1px solid red',
        boxSizing: 'border-box',
        maxWidth: '450px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'flex-start',
          listStyle: 'none',
          boxShadow: 'none',
          m: 0,
          p: 0,
          overflowX: 'auto',
          boxSizing: 'border-box',
          maxWidth: '100%',
        }}
        component="ul"
      >
        {
          subjobs.map(({ id, status, tsUpdate, name }) => (
            <li
              key={`${auditId}-${jobId}-${id}-${tsUpdate}-${status}`}
              style={{
                maxWidth: '100%',
                
              }}
            >
              <Chip
                // className='truncate'
                icon={icons[status]?.component || <HelpOutlineIcon />}
                label={name}
                color={icons[status]?.muiSettings.color || undefined}
                variant={icons[status]?.muiSettings.variant || undefined}
                // onDelete={data.label === 'React' ? undefined : handleDelete(data)}
                onClick={(e) => {
                  if (!isEditable) e.preventDefault()
                  handleToggleSubjob({ subjobId: id })
                }}
              />
            </li>
          ))
        }
      </Box>
    </div>
  )
}, (prevPs, nextPs) => prevPs.jobTsUpdate === nextPs.jobTsUpdate && prevPs.isEditable === nextPs.isEditable)
