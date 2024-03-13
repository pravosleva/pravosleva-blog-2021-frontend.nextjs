import React, { useState, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import moment from 'moment'
import { useSnackbar, SnackbarMessage as TSnackbarMessage, OptionsObject as IOptionsObject } from 'notistack'
import {
  // Block,
  SettingFlexBtn,
} from '~/ui-kit.team-scoring-2019'
import { getTargetDate } from '~/ui-kit.team-scoring-2019/utils/scoring/getTargetDate'
import { ProgressBar } from '~/ui-kit.team-scoring-2019/ProgressBar/Refreshed'
import {
  AbsoluteBottomRightBadge,
  AbsoluteCircleBtn,
  CircleBtn,
  Description,
  MainTitle,
  TopSpace,
} from './components'
import { DesktopDateTimePicker } from './components/DatePicker/DesktopDateTimePicker'
import { MobileInfiniteCalendar } from './components/DatePicker/MobileInfiniteCalendar'
import { groupLog } from '~/utils/groupLog'
import { TTask } from '~/components/time-scoring/types'
import { useCompare } from '~/hooks/useDeepEffect'
// import EditCalendarIcon from '@mui/icons-material/EditCalendar'
import EventIcon from '@mui/icons-material/Event'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import PenIcon from '@mui/icons-material/Edit'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import HelpIcon from '@mui/icons-material/Help'
import StarIcon from '@mui/icons-material/Star'

const DesktopOnly = styled('div')`
  @media (max-width: 767px) {
    display: none;
  }
`
const MobileOnly = styled('div')`
  @media (min-width: 768px) {
    display: none;
  }
`

const Wrapper = styled('div')<{ test?: boolean; }>`
  overflowX; hidden;
  display: flex;
  flex-direction: column;

  overflow-x: hidden;
  overflow-y: auto;

  ${(p) => p.test &&
    css`
      border: 1px solid red;
    `}
  width: 100%;
  min-height: 100svh;
  height: 100%;
  box-sizing: border-box;

  padding: 0 50px 50px 50px;
  @media (max-width: 767px) {
    padding: 0;
  }
  position: absolute;
  top: 0;
  background-image: linear-gradient(
    to right,
    // rgba(98, 178, 208, 0.9),
    rgba(255,120,30,1),
    rgba(32, 107, 235, 0.9),
    #1b7bff
  );
  color: white;

  & ul {
    margin-left: 0;
  }
`
const Item = styled('li').attrs({
  className: 'backdrop-blur--subdark',
})<{ active?: boolean; }>`
  backdrop-filter: unset;
  cursor: pointer;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 10px;
  ${(p) => p.active &&
    css`
      border: 1px solid white;
    `}
  box-shadow: rgba(51, 51, 51, 0.2) 0px 0px 4px;
  transition: all 0.3s linear;

  &:hover {
    box-shadow: rgba(51, 51, 51, 0.4) 0px 0px 4px;
  }
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
`
const StartFinishDatesFlexContainer = styled('div')`
  border: none;
  width: 100%;
  box-sizing: border-box;

  display: flex;
  @media (max-width: 767px) {
    flex-direction: column;
  }
  @media (min-width: 768px) {
    justify-content: center;
  }
`

type TProps = {
  taskList: TTask[];
  addNewEmployeeToLS: any;
  removeEmployeeFromLS: any;
  createNewTask: ({ cb }: { cb?: {
    onSuccess: (e: { isOk: boolean; message?: string; isFirst?: boolean }) => void;
    onError: (e: { isOk: boolean; message?: string; isFirst?: boolean }) => void;
  }}) => void;
  activeTaskID: any;
  activeTaskIDToggler: any;
  assign: any;
  setStartDate: (ts: number, id: number) => void;
  setRealFinishDate: any;
  setForecastFinishDate: any;
  removeTaskFromLS: any;
  employeeNames: any;
  editTask: any;
  activeEmployee: any;
  activeComplexity: any;
  stepCounter: any;
  initStep: any;
  listToggler: any;

  complexityToggler: any;
  sidebarOpened: boolean;
  listOpened: boolean;
}

export const TimeManagementContent = ({
  addNewEmployeeToLS,
  removeEmployeeFromLS,
  createNewTask = () => {
    groupLog({ spaceName: 'createNewTask was not received in props', items: ['createNewTask()'] })
  },
  taskList: tasks,
  activeTaskID,
  activeTaskIDToggler,
  assign,
  setStartDate,
  setRealFinishDate,
  setForecastFinishDate,
  removeTaskFromLS,
  employeeNames,
  editTask,
  activeEmployee,
  activeComplexity,
  stepCounter,
  initStep,
  listToggler,
  
  complexityToggler,
  sidebarOpened,
  listOpened,
}: TProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const toast = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, opts)
  }, [])

  // --- SEARCH:
  const [searchValue, setSearchValue] = useState('')
  const handleSearchValueChange = useCallback((val) => {
    setSearchValue(val)
    // TODO: debounce!
  }, [])
  // ---
  const allTaskList = useMemo<TTask[]>(() => tasks, [tasks])
  const taskList = useMemo<TTask[]>(() => {
    let res

    if (activeComplexity) {
      res = tasks.filter((t) => t.complexity === activeComplexity)
    } else {
      res = tasks
    }
    if (!!searchValue) {
      res = res.filter(
        ({ description }) => description.toLowerCase().indexOf(searchValue.toLowerCase()) > -1,
      )
    }
    return res
  }, [tasks, searchValue, activeComplexity])
  const informativeTaskList = useMemo(
    () => allTaskList
    // .filter(e => activeEmployee ? (e.employee ? e.employee === activeEmployee : false) : true)
      .filter(
        (e) => !!e.startDate && !!e.realFinishDate && !!e.forecastFinishDate,
      )
      .filter(({ description }) => (!!searchValue
        ? description.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        : true))
      .filter(({ description }) => (!!searchValue
        ? description.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
        : true)),
    [useCompare([allTaskList, searchValue])],
  )
  // -- TOOLS
  const [isToolsOpened, setIsToolsOpened] = useState(false)
  const handleToggleToolsPanel = useCallback(() => {
    setIsToolsOpened((state) => !state)
  }, [setIsToolsOpened])
  // --

  const filteredTasks = useMemo<TTask[]>(() => {
    return taskList
      .filter((e) => (activeEmployee
        ? e.employee
          ? e.employee === activeEmployee
          : false
        : true))
  }, [activeEmployee, useCompare([taskList])])

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false)
  const handleOpen = useCallback(() => {
    setIsModalOpened(true)
  }, [setIsModalOpened])
  const handleClose = useCallback((id) => () => {
    setIsModalOpened(false)
    activeTaskIDToggler(id)
  }, [setIsModalOpened, activeTaskIDToggler])

  return (
    <>
      <Wrapper>
        <TopSpace
          isToolsOpened={isToolsOpened}
          employeeNames={employeeNames}
          informativeTaskList={informativeTaskList}
          activeComplexity={activeComplexity}
          createNewTask={createNewTask}
          handleSearchValueChange={handleSearchValueChange}
          removeEmployeeFromLS={removeEmployeeFromLS}
          complexityToggler={complexityToggler}
          handleToggleToolsPanel={handleToggleToolsPanel}

          taskList={taskList}
          addNewEmployeeToLS={addNewEmployeeToLS}
        />

        <p
          style={{
            textAlign: 'center',
            opacity: '0.5',
            margin: '30px 0 30px 0',
          }}
        >
            {activeEmployee
              ? <strong>Filtered by {activeEmployee}</strong>
              : <strong>All tasks ({taskList.length})</strong>
            }
        </p>

        {
          // activeEmployee
          // ? (
          taskList.length > 0 && (
            <>
              <DesktopOnly>
                <ul className="standartList">
                  {taskList
                    .filter((e) => (activeEmployee
                      ? e.employee
                        ? e.employee === activeEmployee
                        : false
                      : true))
                    .map(
                      ({
                        id,
                        employee,
                        description,
                        startDate = null,
                        realFinishDate = null,
                        forecastFinishDate = null,
                        complexity,
                      }) => {
                        const hasTaskListAsExperience =
                          allTaskList.filter(
                            ({
                              employee: e,
                              complexity: c,
                              startDate,
                              realFinishDate,
                              forecastFinishDate,
                            }: any) => !!startDate &&
                              !!realFinishDate &&
                              !!forecastFinishDate &&
                              c === complexity &&
                              e === employee,
                          ).length > 0
                        const isCompleted =
                          !!startDate &&
                          !!realFinishDate &&
                          !!forecastFinishDate
                        const isInProgress =
                          !realFinishDate && !!startDate && !!forecastFinishDate
                        const targetDate = getTargetDate({
                          taskList: allTaskList.filter(
                            ({
                              employee: e,
                              complexity: c,
                              startDate,
                              realFinishDate,
                              forecastFinishDate,
                            }: any) => !!startDate &&
                              !!realFinishDate &&
                              !!forecastFinishDate &&
                              c === complexity &&
                              e === employee,
                          ),
                          testDiff:
                            // @ts-ignore
                            new Date(forecastFinishDate).getTime() - new Date(startDate).getTime(),
                          // @ts-ignore
                          testStart: startDate,
                        })
                        // const isGoodResult =
                        //   isCompleted &&
                        //   moment(targetDate).valueOf() >= realFinishDate
                        let percentage
                        if (isCompleted) {
                          percentage = (
                            (1 -
                              (targetDate - startDate) /
                                (realFinishDate - startDate)) *
                            100
                          ).toFixed(1)
                        }

                        return (
                          <Item
                            key={id}
                            active={activeTaskID === id}
                            onClick={() => {
                              // e.stopPropagation();
                              activeTaskIDToggler(id)
                              listToggler(false)
                            }}
                          >
                            <AbsoluteCircleBtn
                              onClick={(e) => {
                                e.stopPropagation()
                                removeTaskFromLS(id)
                              }}
                            >
                              {/* <i
                                className="fa fa-trash"
                                style={{ fontSize: '14px', color: 'white' }}
                            /> */}
                              <DeleteIcon fontSize='small' htmlColor='#fff' />
                            </AbsoluteCircleBtn>
                            <AbsoluteCircleBtn
                              topRightStyles="top: 10px; right: 50px;"
                              onClick={(e) => {
                                e.stopPropagation()
                                editTask(id, {
                                  id,
                                  employee,
                                  description,
                                  startDate,
                                  realFinishDate,
                                  forecastFinishDate,
                                  complexity,
                                })
                              }}
                            >
                              {/* <i
                                className="fa fa-pen"
                                style={{ fontSize: '12px', color: 'white' }}
                              /> */}
                              <PenIcon fontSize='small' htmlColor='#fff' />
                            </AbsoluteCircleBtn>
                            {
                              !!realFinishDate && (
                                <AbsoluteCircleBtn
                                  topRightStyles="top: 10px; right: 90px;"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const isConfirmed = window.confirm('⚠️ Реальное время финиша будет сброшено. Ok?')
                                    if (isConfirmed) setRealFinishDate(null, id)
                                  }}
                                  title='Кнопка сброса параметра "реального финиша" realFinishDate (например, если вы хотите добавить время). Сейчас эта задача формирует статистику.'
                                >
                                  {/* <i
                                    className="fa fa-power-off"
                                    style={{ fontSize: '14px', color: 'white' }}
                                  /> */}
                                  <PowerSettingsNewIcon htmlColor='#fff' fontSize='small' />
                                </AbsoluteCircleBtn>
                              )
                            }

                            <MainTitle>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '8px',
                                }}
                              >
                                <b>{employee}</b>
                                
                                {/* <CircleBtn
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.alert('Сложность фичи от 1 до 5')
                                  }}
                                >
                                  <>
                                    <i
                                      className="fa fa-star"
                                      style={{
                                        fontSize: '12px',
                                        color: '#fff',
                                        opacity: '0.3'
                                      }}
                                    />
                                    <span style={{ opacity: '0.3', marginLeft: '3px', color: '#fff' }}>{complexity}</span>
                                  </>
                                </CircleBtn> */}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', opacity: '0.3', color: '#fff' }}>
                                  {/* <i
                                    className="fa fa-star"
                                    style={{ fontSize: '12px' }}
                                  /> */}
                                  <StarIcon fontSize='small' htmlColor='#fff' />
                                  <span>{complexity}</span>
                                </div>
                                
                                {!!percentage && (
                                  <>
                                    <span>•</span>
                                    <span>
                                      {`${percentage} %`}
                                    </span>
                                    <CircleBtn
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.alert('Процент отклонения по времени относительно самого неудачного кейса аналогичной сложности')
                                      }}
                                    >
                                      {/* <i
                                        className="fa fa-question"
                                        style={{ fontSize: '14px', color: 'white' }}
                                      /> */}
                                      <HelpIcon fontSize='small' htmlColor='#fff' />
                                    </CircleBtn>
                                  </>
                                )}
                              </div>
                              <div>
                                {/* <small>{description || 'No description'}</small> */}
                                <Description source={description} />
                                {hasTaskListAsExperience && isInProgress && (
                                  <>
                                    <div style={{ opacity: '0.5', marginBottom: '8px', fontWeight: 'bold' }}>
                                      <small>{`Ориентировочное время ${new Date(targetDate).toLocaleDateString()}`}</small>
                                    </div>
                                    {/*
                                      <ProgressBar
                                        label={`${getCurrentPercentage({ startDate, targetDate: getTargetDate({
                                          taskList: taskList
                                            .filter(({ employee: e, complexity: c, startDate, realFinishDate, forecastFinishDate }) => !!startDate && !!realFinishDate && !!forecastFinishDate && c === complexity && e === employee ),
                                          testDiff: moment(forecastFinishDate) - moment(startDate),
                                          testStart: moment(startDate)
                                        }) }).toFixed(2)} %`}
                                        value={getCurrentPercentage({ startDate, targetDate: getTargetDate({
                                          taskList: taskList
                                            .filter(({ employee: e, complexity: c, startDate, realFinishDate, forecastFinishDate }) => !!startDate && !!realFinishDate && !!forecastFinishDate && c === complexity && e === employee ),
                                          testDiff: moment(forecastFinishDate) - moment(startDate),
                                          testStart: moment(startDate)
                                        })})}
                                      />
                                      */}
                                    <ProgressBar
                                      startDate={new Date(startDate).getTime()}
                                      // @ts-ignore
                                      targetDate={getTargetDate({
                                        taskList: allTaskList.filter(
                                          ({
                                            employee: e,
                                            complexity: c,
                                            startDate,
                                            realFinishDate,
                                            forecastFinishDate,
                                          }: any) => !!startDate &&
                                            !!realFinishDate &&
                                            !!forecastFinishDate &&
                                            c === complexity &&
                                            e === employee,
                                        ),
                                        testDiff: new Date(forecastFinishDate).getTime() - new Date(startDate).getTime(),
                                        testStart: new Date(startDate).getTime(),
                                      })}
                                    />
                                  </>
                                )}
                              </div>
                            </MainTitle>

                            {startDate && !realFinishDate ? (
                              <AbsoluteBottomRightBadge>
                                <em>
                                  <small>
                                    {startDate > new Date().getTime()
                                      ? 'Will be started '
                                      : 'Started '}
                                    {' '}
                                    {moment(
                                      moment(startDate),
                                      'YYYYMMDD',
                                    ).fromNow()}
                                  </small>
                                </em>
                              </AbsoluteBottomRightBadge>
                            ) : startDate && realFinishDate ? (
                              <AbsoluteBottomRightBadge>
                                <em>
                                  <small>
                                    {realFinishDate > new Date().getTime()
                                      ? 'Will be finished '
                                      : 'Finished '}
                                    {' '}
                                    {moment(
                                      moment(realFinishDate),
                                      'YYYYMMDD',
                                    ).fromNow()}
                                  </small>
                                </em>
                              </AbsoluteBottomRightBadge>
                            ) : null}

                            {activeTaskID === id ? (
                              <>
                                <StartFinishDatesFlexContainer
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div style={{ flex: '1 1 auto' }}>
                                    <DesktopDateTimePicker
                                      selectedDate={startDate}
                                      setDate={setStartDate}
                                      id={id}
                                      label="СТАРТ"
                                    />
                                  </div>
                                  <div style={{ flex: '1 1 auto' }}>
                                    <DesktopDateTimePicker
                                      selectedDate={realFinishDate}
                                      setDate={setRealFinishDate}
                                      id={id}
                                      label="РЕАЛЬНЫЙ ФИНИШ"
                                    />
                                  </div>
                                </StartFinishDatesFlexContainer>

                                <div
                                  style={{
                                    border: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <SettingFlexBtn
                                    assigned={Boolean(employee)}
                                    onClick={() => {
                                      if (employee) {

                                        toast(
                                          'Sorry, could not be reassigned.\nMay be in future...',
                                          { autoHideDuration: 7000, variant: 'warning' },
                                        )
                                        return
                                      }
                                      if (employeeNames.length === 0) {
                                        toast(
                                          'Please, add an employee before',
                                          { autoHideDuration: 7000, variant: 'warning' },
                                        )
                                        return
                                      }
                                      assign(id)
                                    }}
                                    // disabled={employee ? true : (employeeNames.length > 0 ? false : true)}
                                  >
                                    {employee
                                      ? `Assigned to ${employee}`
                                      : employeeNames.length > 0
                                        ? 'ASSIGN'
                                        : 'COULD NOT BE ASSIGNED'}
                                  </SettingFlexBtn>
                                </div>

                                <div
                                  style={{
                                    border: 'none',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div style={{ flex: '1 1 auto' }}>
                                    <DesktopDateTimePicker
                                      selectedDate={forecastFinishDate}
                                      setDate={setForecastFinishDate}
                                      id={id}
                                      label="ПРОГНОЗ ИСПОЛНИТЕЛЯ"
                                    />
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </Item>
                        )
                      },
                    )
                    .reverse()}
                </ul>
              </DesktopOnly>
              <MobileOnly>
                <ul className="standartList-mobile">
                  {
                    filteredTasks.map(
                      (task) => {
                        const {
                          id,
                          employee,
                          description,
                          startDate = null,
                          realFinishDate = null,
                          forecastFinishDate = null,
                          complexity,
                        } = task
                        const hasStat = allTaskList.filter(
                          ({
                            employee: e,
                            complexity: c,
                            startDate,
                            realFinishDate,
                            forecastFinishDate,
                          }: any) => !!startDate &&
                            !!realFinishDate &&
                            !!forecastFinishDate &&
                            c === complexity &&
                            e === employee,
                        ).length > 0
                        const targetDate = getTargetDate({
                          taskList: allTaskList.filter(
                            ({
                              employee: e,
                              complexity: c,
                              startDate,
                              realFinishDate,
                              forecastFinishDate,
                            }: any) => !!startDate &&
                              !!realFinishDate &&
                              !!forecastFinishDate &&
                              c === complexity &&
                              e === employee,
                          ),
                          testDiff:
                            // @ts-ignore
                            new Date(forecastFinishDate).getTime() - new Date(startDate).getTime(),
                          // @ts-ignore
                          testStart: startDate,
                        })

                        return (
                          <li
                            key={id}
                            style={{ position: 'relative' }}
                          >
                            <button
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '50%',
                                backgroundColor: 'transparent',
                                boxShadow: 'rgba(51, 51, 51, 0.2) 0px 0px 4px',
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                removeTaskFromLS(id)
                              }}
                            >
                              {/* <i
                                className="fa fa-trash"
                                style={{ fontSize: '14px', color: 'white' }}
                              /> */}
                              <DeleteIcon fontSize='small' htmlColor='#fff' />
                            </button>
                            <button
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '50px',
                                border: 'none',
                                outline: 'none',
                                cursor: 'pointer',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '50%',
                                backgroundColor: 'transparent',
                                boxShadow: 'rgba(51, 51, 51, 0.2) 0px 0px 4px',
                              }}
                              onClick={(e) => {
                                e.stopPropagation()
                                editTask(id, {
                                  id,
                                  employee,
                                  description,
                                  startDate,
                                  realFinishDate,
                                  forecastFinishDate,
                                  complexity,
                                })
                              }}
                            >
                              {/* <i
                                className="fa fa-pencil-alt"
                                style={{ fontSize: '12px', color: 'white' }}
                              /> */}
                              <PenIcon fontSize='small' htmlColor='#fff' />
                            </button>
                            {
                              !!realFinishDate && (
                                <button
                                  style={{
                                    position: 'absolute',
                                    top: '50px',
                                    right: '10px',
                                    border: 'none',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '50%',
                                    backgroundColor: 'transparent',
                                    boxShadow: 'rgba(51, 51, 51, 0.2) 0px 0px 4px',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // removeTaskFromLS(id)
                                    const isConfirmed = window.confirm('⚠️ Реальное время финиша будет сброшено. Ok?')

                                    if (isConfirmed) setRealFinishDate(null, id)
                                  }}
                                >
                                  {/* <i
                                    className="fa fa-power-off"
                                    style={{ fontSize: '14px', color: 'white' }}
                                  /> */}
                                  <PowerSettingsNewIcon htmlColor='#fff' fontSize='small' />
                                </button>
                              )
                            }
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                // borderTop: '1px solid rgba(255,120,30,1)',
                                borderTop: '1px solid #fff',
                                
                                // textAlign: 'center',
                                padding: '0 16px 0 16px ',
                                cursor: 'pointer',
                                opacity: activeTaskID
                                  ? activeTaskID === id
                                    ? 1
                                    : 0.5
                                  : 1,
                              }}
                              onClick={() => {
                                // e.stopPropagation();
                                activeTaskIDToggler(id)
                                
                                const targetStep = !!startDate ? !!forecastFinishDate ? !!realFinishDate ? 0 : 2 : 1 : 0
                                initStep(targetStep)
                              }}
                            >
                              <>
                                {(() => {
                                  // const dscrAsArr = description.split('\n')
                                  // if (dscrAsArr.length > 1) return (
                                  //   <div style={{ display: 'flex', flexDirection: 'column', }}>
                                  //     <strong style={{ lineHeight: '50px' }}>{`#${id}`}</strong>
                                  //     <span>{dscrAsArr[0]}...</span>
                                  //   </div>
                                  // )
                                  
                                  return (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ lineHeight: '50px', display: 'flex', flexDirection: 'row', gap: '8px' }}><b>{`#${id}`}</b><span>•</span><span>{employee}</span></span>
                                      <span>{description}</span>
                                    </div>
                                    )
                                })()}
                                {
                                  hasStat && !!startDate && !!forecastFinishDate && !realFinishDate &&  (
                                    <>
                                      <div style={{ opacity: '0.5', fontWeight: 'bold' }}>
                                        <small>{`Ориентировочное время ${new Date(targetDate).toLocaleDateString()}`}</small>
                                      </div>
                                      <ProgressBar
                                        startDate={startDate}
                                        // @ts-ignore
                                        targetDate={getTargetDate({
                                          taskList: allTaskList.filter(
                                            ({
                                              employee: e,
                                              complexity: c,
                                              startDate,
                                              realFinishDate,
                                              forecastFinishDate,
                                            }: any) => !!startDate &&
                                              !!realFinishDate &&
                                              !!forecastFinishDate &&
                                              c === complexity &&
                                              e === employee,
                                          ),
                                          testDiff: forecastFinishDate - startDate,
                                          testStart: startDate,
                                        })}
                                      />
                                    </>
                                  )
                                }
                                <pre style={{ margin: 0 }}>{JSON.stringify({ startDate, forecastFinishDate, realFinishDate }, null, 2)}</pre>
                                <div style={{ display: 'flex', lineHeight: 'unset', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                  {activeTaskID === id ? (
                                    // <i
                                    //   style={{ marginBottom: '16px' }}
                                    //   // className='fa fa-chevron-circle-up'
                                    //   className='fas fa-times-circle'
                                    // />
                                    <CloseIcon style={{ marginBottom: '16px' }} />
                                  ) : (
                                    // <i
                                    //   // className='fa fa-chevron-circle-down'
                                    //   className='fas fa-calendar'
                                    // />
                                    <EventIcon style={{ marginBottom: '16px' }} />
                                  )}
                                </div>
                              </>
                            </div>

                            {activeTaskID === id ? (
                              <div>
                                {!sidebarOpened && !listOpened
                                  ? ((step) => {
                                    switch (step) {
                                      case 0:
                                        return (
                                          <div className="section-header">
                                            <span
                                              style={{ textAlign: 'center' }}
                                            >
                                              Шаг 1.
                                              {' '}
                                              {startDate ? 'Переустановите' : 'Установите'}
                                              {' '}
                                              <strong>startDate</strong>
                                            </span>
                                          </div>
                                        )
                                      case 1:
                                        return (
                                          <div className="section-header">
                                            <span
                                              style={{ textAlign: 'center' }}
                                            >
                                              Шаг 2.
                                              {' '}
                                              {forecastFinishDate ? 'Переустановите' : 'Установите'}
                                              {' '}
                                              <strong>
                                                forecastFinishDate
                                              </strong>
                                            </span>
                                          </div>
                                        )
                                      case 2:
                                        return (
                                          <div className="section-header">
                                            <span
                                              style={{ textAlign: 'center' }}
                                            >
                                              Шаг 3.
                                              {' '}
                                              {realFinishDate ? 'Переустановите' : 'Установите'}
                                              {' '}
                                              <strong>realFinishDate</strong>
                                            </span>
                                          </div>
                                        )
                                      default:
                                        return null
                                    }
                                  })(stepCounter)
                                  : null
                                }

                                {/* https://github.com/pravosleva/time-management/issues/1 */}
                                
                                {/* @ts-ignore */}
                                
                                <MobileInfiniteCalendar
                                  setStartDate={setStartDate}
                                  setForecastFinishDate={setForecastFinishDate}
                                  setRealFinishDate={setRealFinishDate}
                                  stepCounter={stepCounter}
                                  initStep={initStep}
                                  {...task}
                                  isModalOpened={isModalOpened}
                                  onOpen={handleOpen}
                                  onClose={handleClose}
                                />

                                {/* <DatePicker
                                  onChange={(e) => {
                                    console.log(e)
                                  }}
                                  value={value}
                                /> */}
                              </div>
                            ) : null}
                            
                            {/* startDate && !realFinishDate ? (
                              <>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    opacity: '0.5',
                                    lineHeight: 'normal',
                                    textAlign: 'center',
                                  }}
                                >
                                  <em>
                                    {startDate > new Date().getTime()
                                      ? 'Will be started '
                                      : 'Started '}
                                    {' '}
                                    {moment(
                                      moment(startDate),
                                      'YYYYMMDD',
                                    ).fromNow()}
                                  </em>
                                </div>
                              </>
                            ) : startDate && realFinishDate ? (
                              <>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    opacity: '0.5',
                                    lineHeight: 'normal',
                                    textAlign: 'center',
                                  }}
                                >
                                  <em>
                                    {startDate > new Date().getTime()
                                      ? 'Will be started '
                                      : 'Started '}
                                    {' '}
                                    {moment(
                                      moment(startDate),
                                      'YYYYMMDD',
                                    ).fromNow()}
                                    <br />
                                    {moment(realFinishDate) > moment()
                                      ? 'Will be finished '
                                      : 'Finished '}
                                    {' '}
                                    {moment(
                                      moment(realFinishDate),
                                      'YYYYMMDD',
                                    ).fromNow()}
                                    {forecastFinishDate ? (
                                      <>
                                        <br />
                                        {`Planned: ${moment(
                                          moment(forecastFinishDate),
                                          'YYYYMMDD',
                                        ).fromNow()}`}
                                      </>
                                    ) : (
                                      ''
                                    )}
                                  </em>
                                </div>
                              </>
                            ) : null */}
                          </li>
                        )
                      },
                    )
                    .reverse()}
                </ul>
              </MobileOnly>
            </>
          )
        }
      </Wrapper>
    </>
  )
}
