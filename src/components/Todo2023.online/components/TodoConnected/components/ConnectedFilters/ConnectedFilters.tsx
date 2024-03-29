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
import { NTodo, statusUiCodes } from '~/components/audit-helper'
// import DoDisturbIcon from '@mui/icons-material/DoDisturb'
import { MenuAsBtn } from '~/mui'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import StarIcon from '@mui/icons-material/Star'
import { OverridableStringUnion } from '@mui/types'
import {
  // ButtonPropsVariantOverrides,
  ButtonPropsColorOverrides,
  // ButtonPropsSizeOverrides,
  Badge,
} from '@mui/material'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import InfoIcon from '@mui/icons-material/Info'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import ClearIcon from '@mui/icons-material/Clear'
import { red } from '@mui/material/colors'
import { useCompare } from '~/hooks/useDeepEffect'

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
export const InvertedStatusColors: {
  [key in NTodo.EStatus]: string;
} = {
  [NTodo.EStatus.DANGER]: '#fff',
  [NTodo.EStatus.WARNING]: '#fff',
  [NTodo.EStatus.IS_DONE]: '#fff',
  [NTodo.EStatus.SUCCESS]: '#fff',
  [NTodo.EStatus.INFO]: '#fff',
  [NTodo.EStatus.NO_STATUS]: red[500],
}

export const ConnectedFilters = () => {
  const [todoPriorityFilter, setStore] = useStore((store) => store.todoPriorityFilter)
  const [todoStatusFilter] = useStore((store) => store.todoStatusFilter)
  const [namespacesFilter] = useStore((store) => store.namespacesFilter)
  const strapiTodos = useSelector((store: IRootState) => store.todo2023NotPersisted.strapiTodos)
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
    setStore({ todoStatusFilter: null, todoPriorityFilter: null, namespacesFilter: [] })
  }, [])

  const hasAnyFilter = useMemo(() => (
    typeof todoPriorityFilter === 'number'
    || !!todoStatusFilter
    || namespacesFilter.length > 0
  ), [todoPriorityFilter, todoStatusFilter, namespacesFilter])

  const filteredCounter = useMemo<number>(() => {
    if (!todoPriorityFilter && !todoStatusFilter && namespacesFilter.length === 0) {
      return strapiTodos.length
    } else return strapiTodos.reduce((acc, cur) => {

      let isValid = true
      switch (true) {
        case typeof todoPriorityFilter === 'number' && cur.priority !== todoPriorityFilter:
        case !!todoStatusFilter && todoStatusFilter !== cur.status:
        case namespacesFilter.length > 0 && !namespacesFilter.includes(cur.namespace):
          isValid = false
          break
        default:
          break
      }
      if (isValid) acc += 1

      return acc
    }, 0)
  }, [todoPriorityFilter, todoStatusFilter, useCompare([namespacesFilter, strapiTodos])])

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <Badge
        badgeContent={filteredCounter}
        color={!!hasAnyFilter ? 'primary' : 'primary'}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mr: 1,
        }}
        showZero
      >
        <IconButton
          aria-label='reset all filtes'
          disabled={!hasAnyFilter}
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
      </Badge>
      
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
          label={`${todoPriorityFilter || '?'}`}
          items={[
            {
              label: 'Off',
              value: null,
              ItemIcon: <ClearIcon />,
              // hasDividerAfter: true,
              isSelected: !todoPriorityFilter,
            },
            {
              label: '1',
              value: 1,
              ItemIcon: <StarIcon />,
              isSelected: todoPriorityFilter === 1,
            },
            {
              label: '2',
              value: 2,
              ItemIcon: <StarIcon />,
              isSelected: todoPriorityFilter === 2,
            },
            {
              label: '3',
              value: 3,
              ItemIcon: <StarIcon />,
              isSelected: todoPriorityFilter === 3,
            },
            {
              label: '4',
              value: 4,
              ItemIcon: <StarIcon />,
              isSelected: todoPriorityFilter === 4,
            },
            {
              label: '5',
              value: 5,
              ItemIcon: <StarIcon />,
              isSelected: todoPriorityFilter === 5,
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
          // flexWrap: 'nowrap',
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
          label='Status'
          items={[
            {
              label: 'All',
              value: null,
              ItemIcon: <ClearIcon />,
              // hasDividerAfter: true,
              isSelected: !todoStatusFilter,
            },
            {
              label: statusUiCodes[NTodo.EStatus.INFO],
              value: NTodo.EStatus.INFO,
              ItemIcon: <InfoIcon color='info' />,
              isSelected: todoStatusFilter === NTodo.EStatus.INFO,
            },
            {
              label: statusUiCodes[NTodo.EStatus.WARNING],
              value: NTodo.EStatus.WARNING,
              ItemIcon: <WarningIcon color='warning' />,
              isSelected: todoStatusFilter === NTodo.EStatus.WARNING,
            },
            {
              label: statusUiCodes[NTodo.EStatus.DANGER],
              value: NTodo.EStatus.DANGER,
              ItemIcon: <ReportIcon color='error' />,
              isSelected: todoStatusFilter === NTodo.EStatus.DANGER,
            },
            {
              label: statusUiCodes[NTodo.EStatus.SUCCESS],
              value: NTodo.EStatus.SUCCESS,
              ItemIcon: <CheckCircleIcon color='success' />,
              isSelected: todoStatusFilter === NTodo.EStatus.SUCCESS,
            },
            {
              label: statusUiCodes[NTodo.EStatus.IS_DONE],
              value: NTodo.EStatus.IS_DONE,
              ItemIcon: StatusIcons[NTodo.EStatus.IS_DONE],
              isSelected: todoStatusFilter === NTodo.EStatus.IS_DONE,
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

      <MenuAsBtn
        onSelect={(item) => {
          // @ts-ignore
          setStore({ namespacesFilter: [item.value] })
        }}
        btn={{
          color: 'primary',
          variant: namespacesFilter.length > 0 ? 'contained' : 'outlined',
          // endIcon: !!todoStatusFilter ? StatusIcons[todoStatusFilter] : undefined, // <PanoramaFishEyeIcon />,
          size: 'small',
        }}
        label={namespacesFilter.length > 0 ? namespacesFilter.join(', ') : 'Namespaces'}
        items={
          [...new Set(strapiTodos.map(({ namespace }) => namespace))]
            // .filter((val => !namespacesFilter.includes(val)))
            .map((value) => ({ label: value, value, isSelected: namespacesFilter.includes(value) }))
        }
        // badgeCounter={namespacesFilter.length}
      />
    </div>
  )
}
