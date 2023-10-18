/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
import React, { useState, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
// https://www.npmjs.com/package/react-datepicker
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
// import InfiniteCalendar, {
//   Calendar,
//   withMultipleDates,
//   defaultMultipleDateInterpolation,
// } from 'react-infinite-calendar'
// import 'react-infinite-calendar/styles.css' // only needs to be imported once
import { useSnackbar, SnackbarMessage as TSnackbarMessage, OptionsObject as IOptionsObject } from 'notistack'
import {
  // Block,
  Btn,
  ClosableSearchPanelToggler,
  Pie,
  SettingFlexBtn,
} from '~/ui-kit.special'
import { getTargetDate } from '~/ui-kit.special/utils/scoring/getTargetDate'
import { ProgressBar } from '~/ui-kit.special/ProgressBar/Refreshed'
import {
  AbsoluteBottomRightBadge,
  AbsoluteCircleBtn,
  CircleBtn,
  Description,
  MainTitle,
} from './components'
import { DesktopDateTimePicker } from './components/DatePicker/DesktopDateTimePicker'
import { MobileInfiniteCalendar } from './components/DatePicker/MobileInfiniteCalendar'
import { groupLog } from '~/utils/groupLog'
import { TTask } from '~/components/time-scoring/types'
import { useCompare } from '~/hooks/useDeepEffect'
// import DatePicker from 'react-date-picker'

// -- NOTE: Custom toast usage
// toast(
//   'Sorry, could not be reassigned.\nMay be in future...',
//   { autoHideDuration: 7000, variant: 'warning' },
// )
// --

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
  min-height: 100dvh;
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
const TopSpaceWrapper = styled('div').attrs({
  // className: 'backdrop-blur--subdark',
})<{ test?: boolean }>`
  ${(p) => p.test &&
    css`
      border: 1px dashed red;
    `}

  overflowX; hidden;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 2;
  /* background-color: rgba(27,123,255,0.8); */
  /* background-color: rgba(0,0,0,0.2); */
  /* background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.45),
    rgba(32, 107, 235, 0.9),
    rgba(0, 0, 0, 0.45)
  ); */
  @media (min-width: 768px) {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  display: flex;
  flex-direction: column;
  gap: 0;
`
const TopSpaceInternalBox = styled('div')<{ test?: boolean }>`
  ${(p) => p.test &&
    css`
      border: 1px dashed red;
    `}
  padding: 0;

  display: flex;
  flex-direction: column;
`
// const BtnsWrapper = styled('div')`
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 16px;
//   margin-bottom: 16px;
//   @media (max-width: 767px) {
//     margin-bottom: 16px;
//   }
// `
const BtnsGrid = styled('div').attrs({
  className: 'backdrop-blur--subdark',
})`
  width: 100%;
  padding: 16px 16px 16px 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  // @media (max-width: 767px) { margin-bottom: 16px; }
`
const StarsExternalWrapper = styled('div').attrs({
  className: 'backdrop-blur--subdark',
})`
  border: none;
  z-index: 1;
`

const StarsWrapper = styled('div')`
  margin: 0 auto;
  padding: 0px 0 16px 0;
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: space-evenly;
`
const DiagramWrapper = styled('div')`
  margin: 0px;
  overflowX: hidden;
  @media (max-width: 600px) {
    width: 100vw !important;
  }
`
const ToolsPanelToggler = styled('div').attrs({
  className: 'backdrop-blur--subdark',
})`
  cursor: pointer;
  border-radius: inherit;

  // &:hover { background-color: rgba(27, 123, 255, 0.2); }
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
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
    [allTaskList, searchValue],
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

  const Diagram = useMemo(() => {
    return taskList.length > 0 && (
      <DiagramWrapper>
        <Pie taskList={informativeTaskList} />
      </DiagramWrapper>
    )
  }, [useCompare([taskList, informativeTaskList])])

  const MemoizedTopSpaceWrapper = useMemo(() => {
    return (
      <TopSpaceWrapper>
        <TopSpaceInternalBox>
          <BtnsGrid>
            <Btn
              color='secondary-outlined'
              onClick={addNewEmployeeToLS}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa fa-plus" />
              <i className="fa fa-user-circle" />
            </Btn>
            {employeeNames &&
            Array.isArray(employeeNames) &&
            employeeNames.length > 0 ? (
              <>
                <Btn color='secondary-outlined' onClick={() => {
                  createNewTask({
                    cb: {
                      onSuccess: ({ isOk, message, isFirst }) => {
                        toast(
                          isFirst ? 'Ваша первая задача создана, теперь установите для нее дату startDate' : (message || 'Что-то пошло не так...'),
                          { autoHideDuration: 10000, variant: isOk ? 'success' : 'error', preventDuplicate: true },
                        )
                      },
                      onError: ({ isOk, message }) => {
                        toast(
                          message || `Что-то пошло не так... ${JSON.stringify({ isOk, message })}`,
                          { autoHideDuration: 10000, variant: 'error' },
                        )
                      },
                    }
                  })
                }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <i className="fa fa-plus" />
                  <span>Task</span>
                </Btn>
                <Btn
                  color='secondary-outlined'
                  onClick={() => removeEmployeeFromLS()}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  <i className="fa fa-minus" />
                  <i className="fa fa-user-circle" />
                </Btn>
              </>
              ) : null}
          </BtnsGrid>

          {isToolsOpened && (
            <>
              <StarsExternalWrapper>
                <StarsWrapper onClick={(e) => e.stopPropagation()}>
                  <ClosableSearchPanelToggler onChange={handleSearchValueChange} />
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <span
                      style={{ cursor: 'pointer' }}
                      key={rate}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (activeComplexity !== rate) complexityToggler(rate)
                      }}
                    >
                      <i
                        className="fa fa-star"
                        style={{
                          transition: 'all 0.3s linear',
                          color: '#fff',
                          opacity: activeComplexity >= rate ? '1' : '0.2',
                        }}
                      />
                    </span>
                  ))}
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (activeComplexity !== 0) complexityToggler(0)
                    }}
                  >
                    <i
                      className="fa fa-ban"
                      style={{
                        transition: 'all 0.3s linear',
                        color: '#fff',
                        opacity: activeComplexity === 0 ? '1' : '0.2',
                      }}
                    />
                  </span>
                </StarsWrapper>
              </StarsExternalWrapper>
              {Diagram}
            </>
          )}
        </TopSpaceInternalBox>
        <ToolsPanelToggler onClick={handleToggleToolsPanel}>
          {isToolsOpened ? (
            <i className="fas fa-chevron-up" />
          ) : (
            <i className="fas fa-chevron-down" />
          )}
        </ToolsPanelToggler>
      </TopSpaceWrapper>
    )
  }, [isToolsOpened, useCompare([employeeNames]), activeComplexity, createNewTask, handleSearchValueChange, removeEmployeeFromLS, complexityToggler, handleToggleToolsPanel, Diagram])

  return (
    <>
      <Wrapper>
        {MemoizedTopSpaceWrapper}

        <p
          style={{
            textAlign: 'center',
            opacity: '0.5',
            margin: '30px 0 40px 0',
          }}
        >
          <strong>
            {activeEmployee
              ? `Filtered by ${activeEmployee}`
              : `All tasks: ${taskList.length}`}
          </strong>
        </p>

        {/* !activeEmployee && informativeTaskList.length > 0 && (
          <Pie taskList={informativeTaskList} />
        ) */}

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
                          taskList.filter(
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
                              <i
                                className="fa fa-trash"
                                style={{ fontSize: '14px', color: 'white' }}
                              />
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
                              <i
                                className="fa fa-pen"
                                style={{ fontSize: '12px', color: 'white' }}
                              />
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
                                  <i
                                    className="fa fa-power-off"
                                    style={{ fontSize: '14px', color: 'white' }}
                                  />
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
                                  <i
                                    className="fa fa-star"
                                    style={{ fontSize: '12px' }}
                                  />
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
                                      <i
                                        className="fa fa-question"
                                        style={{ fontSize: '14px', color: 'white' }}
                                      />
                                    </CircleBtn>
                                  </>
                                )}
                              </div>
                              <div>
                                {/* <small>{description || 'No description'}</small> */}
                                <Description source={description} />
                                {hasTaskListAsExperience && isInProgress && (
                                  <>
                                    <div style={{ opacity: '0.5', marginBottom: '10px', fontWeight: 'bold' }}>
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
                                    {/*
                                      <DatePicker
                                        showMonthDropdown
                                        onChange={arg => setForecastFinishDate(arg, id)}
                                        value={
                                          forecastFinishDate
                                          ? `FORECAST: ${moment(forecastFinishDate).format('MMM Do dd, HH:mm')}`
                                          : 'SET FORECAST DATE'
                                        }
                                        // showTimeSelect
                                        timeFormat='HH:mm'
                                        timeIntervals={60}
                                        minTime={moment(setHours(setMinutes(new Date(), 0), 8))}
                                        maxTime={moment(setHours(setMinutes(new Date(), 0), 23))}
                                        minDate={moment(startDate)}
                                        fixedHeight
                                        shouldCloseOnSelect
                                        openToDate={forecastFinishDate ? moment(forecastFinishDate) : moment()}
                                        selected={forecastFinishDate ? moment(forecastFinishDate) : null}

                                        // See also https://reactdatepicker.com/
                                        // maxDate={moment().add(5, "days")}
                                        // excludeDates={[moment(), moment().subtract(1, "days")]
                                        // highlightDates={[
                                        //   { "react-datepicker__day--highlighted-custom-1": [
                                        //     moment().subtract(4, "days"),
                                        //     moment().subtract(3, "days"),
                                        //     moment().subtract(2, "days"),
                                        //     moment().subtract(1, "days") ]
                                        //   }
                                        // ]}
                                        // includeDates={[moment(), moment().add(1, "days")]}
                                        // filterDate={this.isWeekday}
                                        // openToDate={moment("1993-09-28")}
                                        // renderCustomHeader={({
                                        //   date,
                                        //   changeYear,
                                        //   changeMonth,
                                        //   decreaseMonth,
                                        //   increaseMonth,
                                        //   prevMonthButtonDisabled,
                                        //   nextMonthButtonDisabled,
                                        // }) => {}}
                                        // minTime={setHours(setMinutes(new Date(), 0), 17)}
                                        // maxTime={setHours(setMinutes(new Date(), 30), 20)}
                                        // injectTimes={[
                                        //   setHours(setMinutes(new Date(), 1), 0),
                                        //   setHours(setMinutes(new Date(), 5), 12),
                                        //   setHours(setMinutes(new Date(), 59), 23),
                                        // ]}
                                      />
                                      */}
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
                        return (
                          <li
                            key={Math.random()}
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
                              <i
                                className="fa fa-trash"
                                style={{ fontSize: '14px', color: 'white' }}
                              />
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
                              <i
                                className="fa fa-pencil-alt"
                                style={{ fontSize: '12px', color: 'white' }}
                              />
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
                                  <i
                                    className="fa fa-power-off"
                                    style={{ fontSize: '14px', color: 'white' }}
                                  />
                                </button>
                              )
                            }
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                // border: 'none',
                                
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
                                  )
                                }
                                <pre style={{ margin: 0 }}>{JSON.stringify({ startDate, forecastFinishDate, realFinishDate, employee }, null, 2)}</pre>
                                <div style={{ display: 'flex', lineHeight: 'unset', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                  {activeTaskID === id ? (
                                    <i
                                      style={{ marginBottom: '16px' }}
                                      // className='fa fa-chevron-circle-up'
                                      className='fas fa-times-circle'
                                    />
                                  ) : (
                                    <i
                                      // className='fa fa-chevron-circle-down'
                                      className='fas fa-calendar'
                                    />
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
