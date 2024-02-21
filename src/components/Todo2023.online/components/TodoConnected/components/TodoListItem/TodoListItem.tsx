import baseClasses from '~/mui/baseClasses.module.scss'
import classes from './TodoListItem.module.scss'
import clsx from 'clsx'
import Rating from '@mui/material/Rating'
import {
  // AddNewBtn, AddNewBtn, AuditList, AuditGrid,
  NTodo,
  statusUiCodes,
} from '~/components/audit-helper'
import { SyntheticEvent, useCallback } from 'react'
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
  const handleStarClick = useCallback((_event: SyntheticEvent<Element, Event>, value: number | null) => {
    if (value === todo.priority) return
    const isConfirmed = window.confirm(`#${todo.id} Изменить приоритет ${todo.priority} -> ${value || 0}?`)
    if (isConfirmed) onStarUpdate(value || 0)
  }, [todo.id, onStarUpdate, todo.priority])
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
            label={statusUiCodes[status]}
            items={[
              {
                label: statusUiCodes[NTodo.EStatus.INFO],
                value: NTodo.EStatus.INFO,
                ItemIcon: <InfoIcon color='info' />,
                isSelected: status === NTodo.EStatus.INFO,
              },
              {
                label: statusUiCodes[NTodo.EStatus.WARNING],
                value: NTodo.EStatus.WARNING,
                ItemIcon: <WarningIcon color='warning' />,
                isSelected: status === NTodo.EStatus.WARNING,
              },
              {
                label: statusUiCodes[NTodo.EStatus.DANGER],
                value: NTodo.EStatus.DANGER,
                ItemIcon: <ReportIcon color='error' />,
                isSelected: status === NTodo.EStatus.DANGER,
              },
              {
                label: statusUiCodes[NTodo.EStatus.SUCCESS],
                value: NTodo.EStatus.SUCCESS,
                ItemIcon: <CheckCircleIcon color='success' />,
                isSelected: status === NTodo.EStatus.SUCCESS,
              },
              {
                label: statusUiCodes[NTodo.EStatus.IS_DONE],
                value: NTodo.EStatus.IS_DONE,
                ItemIcon: <CheckCircleIcon />,
                isSelected: status === NTodo.EStatus.IS_DONE,
              },
              {
                label: statusUiCodes[NTodo.EStatus.NO_STATUS],
                value: NTodo.EStatus.NO_STATUS,
                ItemIcon: <PanoramaFishEyeIcon />,
                isSelected: status === NTodo.EStatus.NO_STATUS,
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
                  backgroundColor: 'rgba(255,255,255,0.5)',
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
