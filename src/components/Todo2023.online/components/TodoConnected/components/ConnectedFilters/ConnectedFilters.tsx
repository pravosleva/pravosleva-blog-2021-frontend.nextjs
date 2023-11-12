import { useCallback, useMemo } from 'react'
import { useStore } from '~/components/Todo2023.online/hocs'
// import classes from './ConnectedFilters.module.scss'
import {
  IconButton,
  // Rating,
} from '@mui/material'
import ReportIcon from '@mui/icons-material/Report'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { NTodo } from '~/components/audit-helper'
// import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import { MenuAsBtn } from '~/mui'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { OverridableStringUnion } from '@mui/types'
import {
  // ButtonPropsVariantOverrides,
  ButtonPropsColorOverrides,
  // ButtonPropsSizeOverrides,
} from '@mui/material'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import InfoIcon from '@mui/icons-material/Info'

export const StatusIcons: {
  [key in NTodo.EStatus]: React.ReactNode;
} = {
  [NTodo.EStatus.DANGER]: <ReportIcon />,
  [NTodo.EStatus.WARNING]: <WarningIcon />,
  [NTodo.EStatus.IS_DONE]: <CheckCircleIcon />,
  [NTodo.EStatus.SUCCESS]: <CheckCircleIcon />,
  [NTodo.EStatus.INFO]: <InfoIcon />,
  [NTodo.EStatus.NO_STATUS]: <PanoramaFishEyeIcon />,
}
export const StatusColors: {
  [key in NTodo.EStatus]: OverridableStringUnion<"error" | "warning" | "success" | "primary" | "inherit" | "secondary" | "info", ButtonPropsColorOverrides>;
} = {
  [NTodo.EStatus.DANGER]: 'error',
  [NTodo.EStatus.WARNING]: 'warning',
  [NTodo.EStatus.IS_DONE]: 'inherit',
  [NTodo.EStatus.SUCCESS]: 'success',
  [NTodo.EStatus.INFO]: 'primary',
  [NTodo.EStatus.NO_STATUS]: 'inherit',
}

export const ConnectedFilters = () => {
  const [todoPriorityFilter, setStore] = useStore((store) => store.todoPriorityFilter)
  const [todoStatusFilter] = useStore((store) => store.todoStatusFilter)
  // const handleStarClick = useCallback((_event: SyntheticEvent<Element, Event>, value: number | null) => {
  //   setStore({ todoPriorityFilter: value })
  // }, [])
  // const handleClearPriorityFilter = useCallback(() => {
  //   setStore({ todoPriorityFilter: null })
  // }, [])
  // const handleSetStatusFilter = useCallback((status: NTodo.EStatus) => () => {
  //   setStore({ todoStatusFilter: status })
  // }, [])
  // const handleClearStatusFilter = useCallback(() => {
  //   setStore({ todoStatusFilter: null })
  // }, [])
  const handleClearAllFilters = useCallback(() => {
    setStore({ todoStatusFilter: null, todoPriorityFilter: null })
  }, [])

  const hasAnyFilter = useMemo(() => (typeof todoPriorityFilter === 'number' || !!todoStatusFilter), [todoPriorityFilter, todoStatusFilter])

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <IconButton
        aria-label='reset all filtes'
        // disabled={isDisabled}
        // color=
        onClick={handleClearAllFilters}
        size='small'
      >
        {
          hasAnyFilter ? (
            <FilterAltOffIcon
              color='primary'
              fontSize='small'
            />
          ) : (
            <FilterAltIcon
              color='disabled'
              fontSize='small'
            />
          )
        }
      </IconButton>
      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0px',
        }}
      >
        {/* <Rating
          name='rating-filter'
          size='medium'
          // size='small'
          value={todoPriorityFilter}
          // readOnly
          // disabled
          onChange={handleStarClick}
        /> */}
        <MenuAsBtn
          onSelect={(item) => {
            setStore({ todoPriorityFilter: (typeof item.value === 'number' ? item.value : null) })
          }}
          btn={{
            color: typeof todoPriorityFilter === 'number' ? 'primary' : 'primary',
            variant: typeof todoPriorityFilter === 'number' ? 'contained' : 'outlined',
            // endIcon: <PanoramaFishEyeIcon />,
            startIcon: <StarOutlineIcon />,
            size: 'small',
          }}
          label={`${todoPriorityFilter || 'Stars'}`}
          items={[
            // {
            //   label: 'No',
            //   value: null,
            // },
            {
              label: '1',
              value: 1,
            },
            {
              label: '2',
              value: 2,
            },
            {
              label: '3',
              value: 3,
            },
            {
              label: '4',
              value: 4,
            },
            {
              label: '5',
              value: 5,
            }
          ]}
        />
        {/* <IconButton
          aria-label='reset status filter -> success'
          onClick={handleClearPriorityFilter}
          size='small'
        >
          <DoDisturbIcon
            color={typeof todoPriorityFilter === 'number' ? 'disabled' : 'primary'}
            fontSize='small'
          />
        </IconButton> */}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/*
        <IconButton
          aria-label='set status filter -> danger'
          // disabled={isDisabled}
          // color=
          onClick={() => {
            if (todoStatusFilter !== NTodo.EStatus.DANGER)
              handleSetStatusFilter(NTodo.EStatus.DANGER)()
            else handleClearStatusFilter()
          }}
          size='small'
        >
          <ReportIcon
            color={todoStatusFilter !== NTodo.EStatus.DANGER ? 'disabled' : 'error'}
            fontSize='small'
          />
        </IconButton>
        <IconButton
          aria-label='set status filter -> warning'
          // disabled={isDisabled}
          // color=
          onClick={() => {
            if (todoStatusFilter !== NTodo.EStatus.WARNING)
              handleSetStatusFilter(NTodo.EStatus.WARNING)()
            else handleClearStatusFilter()
          }}
          size='small'
        >
          <WarningIcon
            color={todoStatusFilter !== NTodo.EStatus.WARNING ? 'disabled' : 'warning'}
            fontSize='small'
          />
        </IconButton>
    
        <IconButton
          aria-label='set status filter -> success'
          // disabled={isDisabled}
          // color=
          onClick={() => {
            if (todoStatusFilter !== NTodo.EStatus.SUCCESS)
              handleSetStatusFilter(NTodo.EStatus.SUCCESS)()
            else handleClearStatusFilter()
          }}
          size='small'
        >
          <CheckCircleIcon
            color={todoStatusFilter !== NTodo.EStatus.SUCCESS ? 'disabled' : 'success'}
            fontSize='small'
          />
        </IconButton>
        */}
        <MenuAsBtn
          onSelect={(item) => {
            // @ts-ignore
            setStore({ todoStatusFilter: !!item.value ? item.value : null })
          }}
          btn={{
            color: !!todoStatusFilter ? StatusColors[todoStatusFilter] : 'primary',
            variant: todoStatusFilter ? 'contained' : 'outlined',
            endIcon: !!todoStatusFilter ? StatusIcons[todoStatusFilter] : undefined, // <PanoramaFishEyeIcon />,
            size: 'small',
          }}
          label='Статус'
          items={[
            {
              label: 'All',
              value: null,
            },
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
              label: 'Is done',
              value: NTodo.EStatus.IS_DONE,
            },
          ]}
        />
        {/* <IconButton
          aria-label='reset status filter -> success'
          // disabled={isDisabled}
          // color=
          onClick={handleClearStatusFilter}
          size='small'
        >
          <DoDisturbIcon
            color={!!todoStatusFilter ? 'disabled' : 'primary'}
            fontSize='small'
          />
        </IconButton> */}
        
      </div>
    </div>
  )
}
