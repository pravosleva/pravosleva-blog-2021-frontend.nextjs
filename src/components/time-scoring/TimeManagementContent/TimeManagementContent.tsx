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
  ${(p) => p.test &&
    css`
      border: 1px solid red;
    `}
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;

  padding: 0 50px 50px 50px;
  @media (max-width: 767px) {
    padding: 0;
  }
  position: absolute;
  top: 0;
  background-image: linear-gradient(
    to right,
    rgba(98, 178, 208, 0.9),
    rgba(32, 107, 235, 0.9),
    #1b7bff
  );
  color: white;

  overflow-x: hidden;
  & ul {
    margin-left: 0;
  }
`
const Item = styled('li')<{ active?: boolean; }>`
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
const TopSpaceWrapper = styled('div')`
  width: 100%;

  position: sticky;
  top: 0;
  z-index: 2;
  /* background-color: rgba(27,123,255,0.8); */
  /* background-color: rgba(0,0,0,0.2); */
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.45),
    rgba(32, 107, 235, 0.9),
    rgba(0, 0, 0, 0.45)
  );
  @media (min-width: 768px) {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  display: flex;
  flex-direction: column;
`
const TopSpaceInternalBox = styled('div')`
  padding: 40px 0 20px 0;
  @media (max-width: 767px) {
    padding: 10px 0 0px 0;
  }

  display: flex;
  flex-direction: column;
`
const BtnsWrapper = styled('div')`
  width: 100%;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & > button {
    margin-bottom: 10px;
  }

  & > button:not(:last-child) {
    margin-right: 10px;
  }

  @media (max-width: 767px) {
    margin-bottom: 20px;
  }
`
const StarsWrapper = styled('div')`
  // border: 1px solid red;

  margin: 20px auto 0px auto;
  @media (max-width: 767px) {
    margin: 0px auto 10px auto;
  }
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: space-evenly;
`
const DiagramWrapper = styled('div')`
  margin: 20px 10px 0px;
  @media (max-width: 767px) {
    margin: 20px 0px 0px 0px;
  }
`
const ToolsPanelToggler = styled('div')`
  cursor: pointer;
  border-radius: inherit;

  &:hover {
    background-color: rgba(27, 123, 255, 0.2);
  }
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`

type TProps = {
  taskList: TTask[];
  addNewEmployeeToLS: any;
  removeEmployeeFromLS: any;
  createNewTask: any;
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
  setStep: any;
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
  setStep,
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

  return (
    <>
      <Wrapper>
        <TopSpaceWrapper>
          <TopSpaceInternalBox>
            <BtnsWrapper>
              <Btn onClick={addNewEmployeeToLS}>
                <i className="fa fa-plus" />
                {' '}
                <i className="fa fa-user-circle" />
              </Btn>
              {employeeNames &&
              Array.isArray(employeeNames) &&
              employeeNames.length > 0 ? (
                <>
                  <Btn onClick={() => removeEmployeeFromLS()}>
                    <i className="fa fa-minus" />
                    {' '}
                    <i className="fa fa-user-circle" />
                  </Btn>
                  <Btn onClick={createNewTask}>Create task</Btn>
                </>
                ) : null}
              <ClosableSearchPanelToggler onChange={handleSearchValueChange} />
            </BtnsWrapper>

            {isToolsOpened && (
              <>
                <StarsWrapper onClick={(e) => e.stopPropagation()}>
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

                {taskList.length > 0 && (
                  <DiagramWrapper>
                    <Pie taskList={informativeTaskList} />
                  </DiagramWrapper>
                )}
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

                            <MainTitle>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <b>{employee}</b>
                                
                                <CircleBtn
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.alert('Сложность фичи от 1 до 5')
                                  }}
                                >
                                  <i
                                    className="fa fa-star"
                                    style={{
                                      fontSize: '12px',
                                      color: 'white',
                                      opacity: '0.3'
                                    }}
                                  />
                                </CircleBtn>

                                <span style={{ opacity: '0.3' }}>{complexity}</span>
                                {!!percentage && (
                                  <span>
                                    {`${percentage} %`}
                                  </span>
                                )}
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
                              </div>
                              <div>
                                {/* <small>{description || 'No description'}</small> */}
                                <Description source={description} />
                                {hasTaskListAsExperience && isInProgress && (
                                  <>
                                    <div style={{ opacity: '0.5', marginBottom: '10px' }}>
                                      <small>{`Ориентировочное время: ${new Date(targetDate).toLocaleDateString()}`}</small>
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
                                      label="START DATE"
                                    />
                                  </div>
                                  <div style={{ flex: '1 1 auto' }}>
                                    <DesktopDateTimePicker
                                      selectedDate={realFinishDate}
                                      setDate={setRealFinishDate}
                                      id={id}
                                      label="REAL FINISH DATE"
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
                                      label="FORECAST DATE"
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
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                border: 'none',
                                lineHeight: '50px',
                                textAlign: 'center',
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
                              }}
                            >
                              <span>
                                {(() => {
                                  const dscrAsArr = description.split('\n')

                                  if (dscrAsArr.length > 1) {
                                    return <strong>{dscrAsArr[0]}</strong>
                                  }
                                  return (
                                    <strong>
                                      #
                                      {id}
                                    </strong>
                                  )
                                })()}
                                {employee ? (
                                  <>
                                    <br />
                                    {employee}
                                  </>
                                ) : (
                                  ''
                                )}
                              </span>

                              {activeTaskID === id ? (
                                <i
                                  style={{ margin: '10px 0 30px 0' }}
                                  className="fa fa-chevron-circle-up"
                                />
                              ) : (
                                <i
                                  style={{ margin: '10px 0 30px 0' }}
                                  className="fa fa-chevron-circle-down"
                                />
                              )}
                            </div>
                            {activeTaskID === id ? (
                              <div
                                style={{ marginBottom: '20px' }}
                              >
                                {!sidebarOpened && !listOpened
                                  ? ((step) => {
                                    switch (step) {
                                      case 0:
                                        return (
                                          <div className="section-header">
                                            <span
                                              style={{ textAlign: 'center' }}
                                            >
                                              Step 0:
                                              {' '}
                                              <strong>startDate</strong>
                                              {startDate
                                                ? ' (if necessary)'
                                                : ''}
                                            </span>
                                          </div>
                                        )
                                      case 1:
                                        return (
                                          <div className="section-header">
                                            <span
                                              style={{ textAlign: 'center' }}
                                            >
                                              Step 1:
                                              {' '}
                                              <strong>
                                                forecastFinishDate
                                              </strong>
                                              {forecastFinishDate
                                                ? ' (if necessary)'
                                                : ''}
                                            </span>
                                          </div>
                                        )
                                      case 2:
                                        return (
                                          <div className="section-header">
                                            <span
                                              style={{ textAlign: 'center' }}
                                            >
                                              Step 2:
                                              {' '}
                                              <strong>realFinishDate</strong>
                                              {realFinishDate
                                                ? ' (if necessary)'
                                                : ''}
                                            </span>
                                          </div>
                                        )
                                      default:
                                        return null
                                    }
                                  })(stepCounter)
                                  : null}

                                {/* https://github.com/pravosleva/time-management/issues/1 */}
                                
                                {/* @ts-ignore */}
                                
                                <MobileInfiniteCalendar
                                  setStartDate={setStartDate}
                                  setForecastFinishDate={setForecastFinishDate}
                                  setRealFinishDate={setRealFinishDate}
                                  stepCounter={stepCounter}
                                  setStep={setStep}
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
                            
                            {startDate && !realFinishDate ? (
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
                            ) : null}
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
