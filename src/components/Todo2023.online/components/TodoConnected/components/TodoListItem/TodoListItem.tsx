import baseClasses from '~/mui/baseClasses.module.scss'
import classes from './TodoListItem.module.scss'
import clsx from 'clsx'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import {
  // AddNewBtn, AddNewBtn, AuditList, AuditGrid,
  NTodo,
} from '~/components/audit-helper'
import { SyntheticEvent } from 'react'
import { useWindowSize } from '~/hooks/useWindowSize'
import { MenuAsBtn } from '~/mui'
import { StatusColors, StatusIcons } from '../ConnectedFilters'

type TProps = {
  id: number;
  label: string;
  descr?: string;
  priority: number;
  status: NTodo.EStatus;
  controls: {
    id: string;
    // color: 'primary' | 'secondary' | 'error' | 'success';
    Icon: React.ReactNode;
    onClick: () => void;
    isDisabled?: boolean;
  }[];
  onStarUpdate: (newPriority: number) => void;
  onChangeStatus: (status: NTodo.EStatus) => void;
}

export const TodoListItem = ({
  id,
  label,
  descr,
  priority,
  status,
  controls,
  onStarUpdate,
  onChangeStatus,
}: TProps) => {
  const handleStarClick = (_event: SyntheticEvent<Element, Event>, value: number | null) => {
    console.log(value)
    // console.log(e)
    onStarUpdate(value || 0)
  }
  const { downSm } = useWindowSize()

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
            size={downSm ? 'small' : 'medium'}
            value={priority}
            // readOnly
            // disabled
            onChange={handleStarClick}
          />
        </div>
        
        <div
          className={
            classes.controlsWrapper
          }
        >
          <MenuAsBtn
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
              },
              {
                label: 'Warning',
                value: NTodo.EStatus.WARNING,
              },
              {
                label: 'Danger',
                value: NTodo.EStatus.DANGER,
              },
              {
                label: 'Ok',
                value: NTodo.EStatus.SUCCESS,
              },
              {
                label: 'Завершена',
                value: NTodo.EStatus.IS_DONE,
              },
              {
                label: 'No status',
                value: NTodo.EStatus.NO_STATUS,
              },
            ]}
          />
          {
            controls.map(({ id, Icon, onClick, isDisabled }) => (
              <IconButton
                key={id}
                aria-label={`action ${id}`}
                disabled={isDisabled}
                // color=
                onClick={onClick}
                size='small'
              >
                {Icon}
              </IconButton>
            ))
          }
        </div>
      </div>
      
      <div
        className={clsx(
          classes.bodyWrapper,
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
      </div>

      {/*
        downSm && (
          <div className={classes.rating}>
            <Rating
              name={`rating-${id}`}
              size='medium'
              // size='small'
              value={priority}
              // readOnly
              // disabled
              onChange={handleStarClick}
            />
          </div>
        )
      */}

      {!!descr && <div className={classes.descriptionWrapper}>{descr}</div>}
    </div>
  )
}
