/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-unresolved */
import React from 'react'
import { compose, withStateHandlers } from 'recompose'
import styled, { css } from 'styled-components'
import ReactHtmlParser from 'react-html-parser'
import { MyDayPicker } from '~/components/time-scoring/TimeManagementContent/components/DatePicker/MyDayPicker'
import { getAverageResult } from '~/ui-kit.special/utils/scoring/getAverageResult'
import { Block, FlexColumn, Note, StickyH2, StickyTopBox } from '~/ui-kit.special'
import { Btn } from '~/ui-kit.special/Btn/Btn'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
// import { TTask } from '../types'

const Wrapper = styled("div")`
  width: 100%;
  height: 100%;
  @media (max-width: 767px) {
    top: 0;
    bottom: 0; /* tst */
    position: relative;
  }
  display: flex;
  box-sizing: border-box;
`
const Sidebar = styled("div")<{
  opened: boolean;
}>`
  background-color: white;
  @media (min-width: 768px) {
    min-width: 585px;
    width: 585px;
    /* Should be opened always */
  }
  @media (max-width: 767px) {
    min-height: 100%;
    height: 100%;
    min-width: 100%;
    width: 100%;
    position: absolute;
    transition: transform 0.5s ease-in-out;
    ${(p) => !p.opened &&
      css`
        transform: translateX(-100%);
      `}
  }
  /*
    display: flex;
    justify-content: center;
    align-items: center;
  */
  overflow-y: auto;
  box-sizing: border-box;
  z-index: 3;
`
const Item = styled("div")<{
  active?: boolean;
  allIsActive?: boolean;
}>`
  position: relative;
  // margin-bottom: 20px;
  color: lightgray;
  &:hover {
    color: #333;
  }
  border: none;
  /* box-shadow: rgba(51, 51, 51, 0.2) 0px 0px 4px; */
  ${({ active, allIsActive }) => active &&
    !allIsActive &&
    css`
      color: #333;
    `}
  ${({ allIsActive }) => allIsActive &&
    css`
      color: #333;
    `}
  cursor: pointer;
  transition: color 0.3s ease-in-out;
`


const DayPickerWrapper = styled("div")`
  border: none;
  display: flex;
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    > div:first-child {
      margin-bottom: 10px;
    }
  }
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-evenly;
  }

  margin: 15px 0 15px 0;
`
const getSelectedDays = (testDates: any[], employee: string, type: 'startDate' | 'finishDate' | 'forecastDate'): Date[] => {
  return [
    new Date(
      (() => {
        const obj = testDates.filter((e: any) => Object.keys(e).includes(employee))[0]

        if (obj && obj[employee]) return obj[employee][type]
        return new Date().getTime()
      })(),
    ),
  ]
}

const StickyBottom = styled('div').attrs({
  className: 'backdrop-blur--lite'
})`
  position: sticky;
  bottom: 0;
  margin: 0px 0px 0px 0px;
  // padding: 10px 10px 10px 10px;
  // border-top: 1px solid lightgray;
  z-index: 1;
`

// type TProps = {
//   taskList: TTask[];
//   employeeNames: string[];

//   sidebarOpened: boolean;
//   sidebarToggler: (_a: any) => void;

//   setTestDate: (_e: any) => void;
//   activeEmployeeToggler: (_e: any) => void;
 
//   [key: string]: any;
// }

export const withLeftSidebar = (ComposedComponent: React.ReactNode): React.ReactNode => compose(
  withStateHandlers(
    {
      sidebarOpened: false,
    },
    {
      sidebarToggler: ({ sidebarOpened }, _props) => (val) => {
        // props.dispatch(addCounter());
        return {
          sidebarOpened: val === true || val === false ? val : !sidebarOpened,
        }
      },
    },
  ),
)((props: any) => (
  <Wrapper>
    <Sidebar
      // @ts-ignore
      opened={props.sidebarOpened}
    >
      <ResponsiveBlock>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
          }}
        >
          
            {props.employeeNames.length > 0 ? (
              <div style={{
                marginBottom: '25px',
              }}>{
              props.employeeNames.map((employee: string) => {
                const theTaskList = props.taskList
                  .filter((e: any) => e.employee === employee)
                  .filter((e: any) => !!e.startDate && !!e.realFinishDate && !!e.forecastFinishDate)
                  .filter((e: any) => (!!props.activeComplexity ? e.complexity === props.activeComplexity : true))
                const selectedStartDays = getSelectedDays(
                  props.testDates,
                  employee,
                  "startDate",
                )
                const selectStartDay = (e: any) => props.setTestDate(
                  "startDate",
                  new Date(e).getTime(),
                  employee,
                )
                const selectedForecastDays = getSelectedDays(
                  props.testDates,
                  employee,
                  "finishDate",
                )
                const selectForecastDay = (e: any) => props.setTestDate(
                  "finishDate",
                  new Date(e).getTime(),
                  employee,
                )

                return (
                  <Item
                    key={employee}
                    onClick={(e) => {
                      e.stopPropagation()
                      // props.activeEmployeeToggler(employee);
                    }}
                    active={props.activeEmployee === employee}
                    // allIsActive={!props.activeEmployee}
                  >
                    <StickyTopBox
                      onClick={() => props.activeEmployeeToggler(employee)}
                    >
                      <div
                        style={{
                          display: 'flex',
                          marginBottom: '10px',
                        }}>
                        <div>
                          <strong
                            style={{
                              textDecoration: "underline",
                              fontSize: "18px",
                              // fontWeight: '500',
                              // fontSize: '1.15em',
                              // color: 'rgb(0, 191, 255)',
                              color:
                                props.activeEmployee === employee
                                  ? "#e46046"
                                  : "rgb(0, 191, 255)",
                            }}
                          >
                            <i
                              className={props.activeEmployee === employee ? "fa fa-chevron-up" : "fa fa-chevron-down"}
                              style={{ marginRight: "15px" }}
                            />
                            {employee}
                          </strong>
                        </div>
                        <div
                          style={{
                            marginLeft: "auto",
                            // paddingRight: props.activeEmployee === employee ? '10px' : '0'
                          }}
                        >
                          {
                            // @ts-ignore
                            getAverageResult({
                              theTaskList,
                              employee,
                            }).averageSpeed.toFixed(3)
                          }
                          {" "}
                          /
                          {' '}
                          {theTaskList.length}
                        </div>
                      </div>
                      {/* rgb(255, 149, 0) */}

                      <small>
                        AVG speed
                        {" "}
                        <strong>
                          {
                            // @ts-ignore
                            getAverageResult({
                              theTaskList,
                              employee,
                            }).averageSpeed.toFixed(3)
                          }
                        </strong>
                        {" "}
                        / Total
                        {' '}
                        <strong>{theTaskList.length}</strong>
                      </small>
                    </StickyTopBox>

                    {/* JSON.stringify(props.testDates.filter((e) => Object.keys(e).includes(employee))) */}
                    {props.activeEmployee === employee ? (
                      // && props.testDates
                      // && props.testDates.filter((e) => Object.keys(e).includes(employee))[0]
                      <FlexColumn>
                        <Block>
                          <div
                            style={{
                              // border: '1px solid red',
                              margin: "20px auto 20px auto",
                              maxWidth: "300px",
                              display: "flex",
                              justifyContent: "space-evenly",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {[1, 2, 3, 4, 5].map((rate) => (
                              <span
                                key={rate}
                                onClick={(_e) => {
                                  // e.stopPropagation();
                                  if (props.activeComplexity !== rate) { props.complexityToggler(rate) }
                                }}
                              >
                                <i
                                  className="fa fa-star"
                                  style={{
                                    transition: "all 0.3s linear",
                                    color:
                                      props.activeComplexity >= rate
                                        ? "gray"
                                        : "lightgray",
                                  }}
                                />
                              </span>
                            ))}
                            <span
                              onClick={(_e) => {
                                if (props.activeComplexity !== 0) { props.complexityToggler(0) }
                              }}
                            >
                              <i
                                className="fa fa-ban"
                                style={{
                                  transition: "all 0.3s linear",
                                  color:
                                    props.activeComplexity === 0
                                      ? "gray"
                                      : "lightgray",
                                }}
                              />
                            </span>
                          </div>
                          <Note
                            style={{
                              opacity: "0.5",
                              // marginTop: "10px",
                              cursor: "default",
                            }}
                            // onClick={e => e.stopPropagation()}
                          >
                            <small>
                              Выберите даты старта и прогноза задачи чтобы увидеть
                              анализ на основании предыдущей статистики данного
                              исполнителя. Звездочки - сложность фич.
                            </small>
                          </Note>
                          {/* WAY 1 */}

                          {/*
                            <div
                              style={{ padding: '10px 15px 10px 15px' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div style={{ paddingBottom: '5px' }}>
                                <DatePickerInput
                                  // https://github.com/buildo/rc-datepicker/blob/master/src/README.md
                                  onChange={(e) => props.setTestDate('startDate', moment(e).valueOf(), employee)}
                                  value={(() => {
                                    const obj = props.testDates.filter((e) => Object.keys(e).includes(employee))[0];

                                    if (obj && obj[employee]) { return moment(obj[employee].startDate); }
                                    return moment();
                                  })()}
                                  className='my-custom-datepicker-component'
                                  position='top'
                                  showOnInputClick
                                />
                              </div>
                              <DatePickerInput
                                onChange={(e) => props.setTestDate('finishDate', moment(e).valueOf(), employee)}
                                value={(() => {
                                  const obj = props.testDates.filter((e) => Object.keys(e).includes(employee))[0];

                                  if (obj && obj[employee]) { return moment(obj[employee].finishDate) }
                                  return moment();
                                })()}
                                className='my-custom-datepicker-component'
                                position='bottom'
                                showOnInputClick
                              />

                            </div>
                          */}

                          {/* WAY 2 */}
                          <DayPickerWrapper
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div>
                              <MyDayPicker
                                selectedDays={selectedStartDays}
                                onDayClick={selectStartDay}
                              />
                            </div>
                            <div>
                              <MyDayPicker
                                selectedDays={selectedForecastDays}
                                onDayClick={selectForecastDay}
                              />
                            </div>
                          </DayPickerWrapper>

                          <Note>
                            <em>
                              date 50% 🫵
                              {" "}
                              {(() => {
                                const obj = props.testDates.filter((e: any) => Object.keys(e).includes(employee))[0]

                                if (!obj) return null

                                const result = getAverageResult({
                                  theTaskList,
                                  employee,
                                  testDiff: obj[employee].finishDate - obj[employee].startDate,
                                  testStart: new Date(
                                    props.testDates.filter((e: any) => Object.keys(e).includes(employee))[0]
                                      ? obj[employee].startDate
                                      : null,
                                  ).getTime(),
                                  // testFinish
                                })

                                if (obj) return new Date(result.date50).toDateString()
                                
                                return "-"
                              })()}
                            </em>
                          </Note>
                        </Block>
                      </FlexColumn>
                    ) : null}
                  </Item>
                )
              })
            }</div>) : (
              <FlexColumn>
                <StickyH2>
                  <i
                    className="fa fa-user-circle"
                    style={{ marginRight: "15px" }}
                  />
                  Employees
                </StickyH2>
                <Block>
                  <Note>Добавьте первого исполнителя...</Note>
                </Block>
              </FlexColumn>
            )
          }
          
          <FlexColumn>
            <StickyH2>
              <i className="fa fa-info" style={{ marginRight: "15px" }} />
              By the way...
            </StickyH2>
            {/*
            <p>taskList= {JSON.stringify(props.taskList)}<br />testDates= {JSON.stringify(props.testDates)}</p>
            */}
            <Block>
              <Note>
                Для объективной статистики у выбранного исполнителя должны быть
                завершенные задачи с параметрами:
                <ul>
                  {[
                    "<strong>startDate</strong> - время начала выполнения задачи",
                    "<strong>forecastFinishDate</strong> - прогноз на выполнение",
                    "<strong>realFinishDate</strong> - время фактического выполнения задачи",
                  ].map((str) => <li key={Math.random()}>{ReactHtmlParser(str)}</li>)}
                </ul>
              </Note>
            </Block>
          </FlexColumn>

          <>
            <StickyBottom>
              <StickyH2>
                <i className="fa fa-info" style={{ marginRight: "15px" }} />
                Feedback
              </StickyH2>
              <Block
                style={{
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <Btn
                  color='primary'
                  onClick={() => {
                    // @ts-ignore
                    if (typeof window !== 'undefined') window.open('/', '_self').focus()
                  }}
                  style={{ minWidth: '60px' }}
                >
                  <i className="fa fa-home" style={{ marginRight: '5px' }} />
                  {' '}
                  Home
                </Btn>
                <Btn
                  color='primary'
                  onClick={() => {
                    // @ts-ignore
                    if (typeof window !== 'undefined') window.open('https://gosuslugi.pravosleva.pro/express-helper/chat/#/chat?room=team-scoring-2019', '_blank').focus()
                  }}
                  style={{ minWidth: '86px' }}
                >
                  <i className="fa fa-comment" style={{ marginRight: '5px' }} />
                  {' '}
                  Feedback Chat
                </Btn>
              </Block>
            </StickyBottom>
          </>
        </div>
      </ResponsiveBlock>
    </Sidebar>
    {/* @ts-ignore */}
    <ComposedComponent {...props} />
  </Wrapper>
))
