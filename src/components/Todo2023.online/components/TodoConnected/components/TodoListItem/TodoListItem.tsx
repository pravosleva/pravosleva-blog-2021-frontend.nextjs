import baseClasses from '~/mui/baseClasses.module.scss'
import classes from './TodoListItem.module.scss'
import clsx from 'clsx'
import Rating from '@mui/material/Rating'
import {
  // AddNewBtn, AddNewBtn, AuditList, AuditGrid,
  NTodo,
} from '~/components/audit-helper'
import { SyntheticEvent } from 'react'
// import { useWindowSize } from '~/hooks/useWindowSize'
import { MenuAsBtn } from '~/mui'
import { StatusColors, StatusIcons } from '../ConnectedFilters'
import { Chip } from '@mui/material'
import ReportIcon from '@mui/icons-material/Report'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
import InfoIcon from '@mui/icons-material/Info'
import { CustomAlert, TCustomAlertControl } from '~/mui'

type TProps = {
  todo: NTodo.TTodo;
  controls: TCustomAlertControl[];
  onStarUpdate: (newPriority: number) => void;
  onChangeStatus: (status: NTodo.EStatus) => void;
  isEditable: boolean;
}

export const TodoListItem = ({
  todo,
  controls,
  onStarUpdate,
  onChangeStatus,
  isEditable,
}: TProps) => {
  const handleStarClick = (_event: SyntheticEvent<Element, Event>, value: number | null) => {
    onStarUpdate(value || 0)
  }
  // const { downSm } = useWindowSize()
  const {
    id,
    label,
    priority,
    description,
    status,
    namespace,
  } = todo

  return (
    <div
      className={clsx(
        baseClasses.stack0,
        classes.wrapper,
      )}
      // style={{ border: '1px solid red' }}
    >
      
      <div className={classes.ratingAndControlsExternalWrapper}>

        <div className={classes.rating}>
          <Rating
            name={`rating-${id}`}
            // size={downSm ? 'small' : 'medium'}
            size='small'
            value={priority}
            // readOnly
            disabled={!isEditable}
            onChange={handleStarClick}
            sx={{ color: 'gray' }}
          />
        </div>

        <div style={{ width: '100%', display: 'flex', alignItems: 'center' }} className='truncate' title={namespace}>
          <Chip
            className='truncate'
            size='small'
            // avatar={<Avatar>{namespace[0].toUpperCase()}</Avatar>}
            label={namespace}
            color='default'
          />
        </div>
        
        <div
          className={
            classes.controlsWrapper
          }
        >
          <MenuAsBtn
            isDisabled={!isEditable}
            onSelect={(item: any) => {
              if (!!item.value) onChangeStatus(item.value)
            }}
            btn={{
              color: !!status ? StatusColors[status] : 'inherit',
              variant: 'text', // status ? 'contained' : 'outlined',
              endIcon: !!status ? StatusIcons[status] : undefined, // <PanoramaFishEyeIcon />,
              size: 'small',
            }}
            label='Статус'
            items={[
              {
                label: 'Info',
                value: NTodo.EStatus.INFO,
                ItemIcon: <InfoIcon color='info' />,
              },
              {
                label: 'Warning',
                value: NTodo.EStatus.WARNING,
                ItemIcon: <WarningIcon color='warning' />,
              },
              {
                label: 'Danger',
                value: NTodo.EStatus.DANGER,
                ItemIcon: <ReportIcon color='error' />,
              },
              {
                label: 'Ok',
                value: NTodo.EStatus.SUCCESS,
                ItemIcon: <CheckCircleIcon color='success' />,
              },
              {
                label: 'Завершена',
                value: NTodo.EStatus.IS_DONE,
                ItemIcon: <CheckCircleIcon />,
              },
              {
                label: 'No status',
                value: NTodo.EStatus.NO_STATUS,
                ItemIcon: <PanoramaFishEyeIcon />,
              },
            ]}
          />
        </div>
      </div>
      
      <div
        className={clsx(
          classes.bodyWrapper,
          baseClasses.stack1,
        )}
      >
        {/* <div
          className={clsx(
            classes.bodyContent,
            {
              [classes.bodyWrapper_info]: status === NTodo.EStatus.INFO,
              [classes.bodyWrapper_warning]: status === NTodo.EStatus.WARNING,
              [classes.bodyWrapper_danger]: status === NTodo.EStatus.DANGER,
              [classes.bodyWrapper_success]: status === NTodo.EStatus.SUCCESS,
              [classes.bodyWrapper_isDone]: status === NTodo.EStatus.IS_DONE,
            }
          )}
        >
          {label}
        </div> */}

        {
          status === NTodo.EStatus.DANGER ? (
            <CustomAlert
              header={label}
              controls={isEditable ? controls : undefined}
              alert={{ variant: 'filled', severity: 'error', sx: { borderRadius: '8px' } }}
            />
          ) : status === NTodo.EStatus.SUCCESS ? (
            <CustomAlert
              header={label}
              controls={isEditable ? controls : undefined}
              alert={{ variant: 'filled', severity: 'success', sx: { borderRadius: '8px' } }}
            />
          ) : status === NTodo.EStatus.INFO ? (
            <CustomAlert
              header={label}
              controls={isEditable ? controls : undefined}
              alert={{ variant: 'filled', severity: 'info', sx: { borderRadius: '8px' } }}
            />
          ) : status === NTodo.EStatus.WARNING ? (
            <CustomAlert
              header={label}
              controls={isEditable ? controls : undefined}
              alert={{ variant: 'filled', severity: 'warning', sx: { borderRadius: '8px' } }}
            />
          ) : status === NTodo.EStatus.IS_DONE ? (
            <CustomAlert
              header={label}
              controls={isEditable ? controls : undefined}
              alert={{
                variant: 'filled',
                sx: {
                  backgroundColor: 'lightgray',
                  borderRadius: '8px',
                },
              }}
            />
          ) : (
            <CustomAlert
              header={label}
              controls={isEditable ? controls : undefined}
              alert={{
                icon: false,
                variant: 'outlined',
                sx: {
                  // border: '1px solid lightgray',
                  border: 'none',
                  borderLeft: '5px solid lightgray',
                  borderRight: '5px solid lightgray',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  fontWeight: 'bold',
                }
              }}
            />
          )
        }

        {!!description && <div className={classes.descriptionWrapper}>{description}</div>}
        
        {/* <div style={{ marginLeft: 'auto' }} className='truncate'>
          <Chip className='truncate' size="small" avatar={<Avatar>{namespace[0].toUpperCase()}</Avatar>} label={namespace} />
        </div> */}

        {/* <pre>{JSON.stringify(todo, null, 2)}</pre> */}
      </div>
    </div>
  )
}
