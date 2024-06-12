/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-unresolved */
import React from 'react'
import { compose, withStateHandlers } from 'recompose'
import styled, { css } from 'styled-components'
import ReactHtmlParser from 'react-html-parser'
import { MyDayPicker } from '~/components/time-scoring/TimeManagementContent/components/DatePicker/MyDayPicker'
import { getAverageResult } from '~/ui-kit.team-scoring-2019/utils/scoring/getAverageResult'
import { Block, CollapsibleBox, FlexColumn, Note, StickyH2, StickyTopBox } from '~/ui-kit.team-scoring-2019'
import { Btn } from '~/ui-kit.team-scoring-2019/Btn/Btn'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
// import { TTask } from '../types'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import HelpIcon from '@mui/icons-material/Help'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
// import BalanceIcon from '@mui/icons-material/Balance'
import StarIcon from '@mui/icons-material/Star'
// import StarBorderIcon from '@mui/icons-material/StarBorder'
import BlockIcon from '@mui/icons-material/Block'
// import TelegramIcon from '@mui/icons-material/Telegram';

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
)((props: any) => {
  return (
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
                  // marginBottom: '25px',
                }}>{
                props.employeeNames.map((employee: string, i: number, arr: string[]) => {
                  const isLast = i === arr.length - 1
                  const isNotActive = props.activeEmployee !== employee

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

                  const getTestDatesAnalysis = (code: 'date0' | 'date50' | 'date100') => ((code: 'date0' | 'date50' | 'date100') => {
                    try {
                      const obj = props.testDates.filter((e: any) => Object.keys(e).includes(employee))[0]

                      if (!obj) throw new Error('⚠️ Проверьте testDates')

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

                      if (!result?.[code]) throw new Error('<b>Проверьте параметры ⚠️</b>')

                      if (obj) return new Date(result[code]).toDateString()
                      
                      return "-"
                    } catch (err: any) {
                      return err?.message || 'No err.message'
                    }
                  })(code)

                  const infoSet = new Set()
                  infoSet.add(getTestDatesAnalysis('date0'))
                  infoSet.add(getTestDatesAnalysis('date50'))
                  infoSet.add(getTestDatesAnalysis('date100'))

                  const descr: string[] = [
                    '👍 <span>В лучшем случае</span>',
                    '⚖️ </i><span>Скорее всего</span>',
                    '👎 <span>В худшем случае</span>',
                  ]
                  let infoHtml: string = ''
                  switch (infoSet.size) {
                    case 3:
                      infoHtml = [...infoSet].map((str, i) => `<span style='display:flex;flex-direction:row;gap:8px;align-items:center;'><span style=\'display:flex;flex-direction:row;gap:8px;align-items:center;\'>${descr[i] || 'No descr'}</span><b>${str}</b></span>`).join('')
                      break
                    case 2:
                      infoHtml = [...infoSet].map((str, i) => `<span style='display:flex;flex-direction:row;gap:8px;align-items:center;'><span style=\'display:flex;flex-direction:row;gap:8px;align-items:center;\'>${i === 0 ? descr[0] : descr[descr.length - 1]}</span><b>${str}</b></span>`).join('')
                      break
                    case 1:
                      infoHtml = [...infoSet].map((str) => `<span style='display:flex;flex-direction:row;gap:8px;align-items:center;'>⚖️ <span>Ожидаемая дата</span><b>${str}</b></span>`).join('')
                      break
                    default:
                      infoHtml = 'Нет данных'
                      break
                  }

                  return (
                    <Item
                      style={{
                        marginBottom: isLast && isNotActive ? '32px' : 0,
                      }}
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
                        style={{
                          borderBottom: props.activeEmployee === employee ? '1px solid lightgray' : 'none',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            // marginBottom: '10px',
                            fontSize: 'smaller',
                            fontFamily: 'Montserrat',

                            lineHeight: 1.65,
                          }}>
                          <>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '16px',
                                // fontSize: "18px",
                                // fontWeight: '500',
                                // fontSize: '1.15em',
                                // color: 'rgb(0, 191, 255)',
                                color:
                                  props.activeEmployee === employee
                                    ? "#e46046"
                                    : "#0162c8",
                              }}
                            >

                              {/* <i className={props.activeEmployee === employee ? "fa fa-chevron-up" : "fa fa-chevron-down"} /> */}
                              {
                                props.activeEmployee === employee
                                  ? <KeyboardArrowUpIcon fontSize='small' />
                                  : <KeyboardArrowDownIcon fontSize='small' />
                              }
                              <div
                                className='truncate'
                                style={{

                                  textDecoration: 'underline',
                                  textTransform: 'uppercase',
                                  marginBottom: '0px',

                                  fontSize: '1rem',
                                  lineHeight: 1.1,
                                  fontWeight: 'bold',

                                  fontFamily: 'Montserrat',
                                  // fontWeight: 'bold',
                                  textRendering: 'optimizeLegibility',
                                  // fontSize: '1.62671rem',
                                  // lineHeight: 1.1,
                                }}
                              >{employee}</div>
                            </div>
                          </>
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
                                  style={{ color: 'gray' }}
                                >
                                  <StarIcon
                                    fontSize='small'
                                    style={{
                                      transition: "all 0.3s linear",
                                      opacity: props.activeComplexity >= rate
                                      ? 1
                                      : 0.2,
                                    }}
                                   />
                                </span>
                              ))}
                              <span
                                onClick={(_e) => {
                                  if (props.activeComplexity !== 0) { props.complexityToggler(0) }
                                }}
                                style={{ color: 'gray' }}
                              >
                                {/* <i
                                  className="fa fa-ban"
                                  style={{
                                    transition: "all 0.3s linear",
                                    color:
                                      props.activeComplexity === 0
                                        ? "gray"
                                        : "lightgray",
                                  }}
                                /> */}
                                <BlockIcon
                                  fontSize='small'
                                  style={{
                                    transition: "all 0.3s linear",
                                    opacity: props.activeComplexity === 0
                                    ? 1
                                    : 0.2,
                                  }}
                                />
                              </span>
                            </div>
                            <Note
                              style={{
                                // opacity: "0.5",
                                marginBottom: "24px",
                                cursor: "default",
                              }}
                              // onClick={e => e.stopPropagation()}
                            >
                              <small>
                                Выберите даты старта и предварительного прогноза от исполнителя:
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

                            <Note
                              style={{ display: 'flex', flexDirection: 'column', gap: '8px', }}
                              dangerouslySetInnerHTML={{
                                __html: infoHtml
                              }}
                            />
                          </Block>
                        </FlexColumn>
                      ) : null}
                    </Item>
                  )
                })
              }</div>) : (
                <FlexColumn>
                  <StickyH2
                    label='Employees'
                    Icon={<i className="fa fa-user-circle" />}
                  />
                  <Block>
                    <Note>Добавьте первого исполнителя...</Note>
                  </Block>
                </FlexColumn>
              )
            }
            
            <FlexColumn>
              <StickyH2
                label='FAQ'
                // Icon={<i className="fas fa-question-circle" />}
                Icon={<HelpIcon />}
              />
              {/*
              <p>taskList= {JSON.stringify(props.taskList)}<br />testDates= {JSON.stringify(props.testDates)}</p>
              */}
              <Block>
                <Note
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <CollapsibleBox
                    label='Что нужно для появления статистики?'
                    descritpion={
                      <p>
                        Для объективной статистики у конкретного исполнителя должны быть
                        завершенные задачи с параметрами:
                        <ul>
                          {[
                            "<code>startDate</code> - время начала выполнения задачи",
                            "<code>forecastFinishDate</code> - прогноз на выполнение",
                            "<code>realFinishDate</code> - время фактического выполнения задачи",
                          ].map((str) => <li key={Math.random()}>{ReactHtmlParser(str)}</li>)}
                        </ul>
                      </p>
                    }
                  />
                  
                  <CollapsibleBox
                    label='Что нужно для отображения прогрессбара задачи в работе?'
                    descritpion={
                      <p>
                        <ul>
                          {[
                            "Хотябы одна завершенная задача, оцененная по срокам",
                            "Если Вы используете фильтр Complexity (сложность фич), убедитесь в том, что завершенные задачи такой сложности в принципе есть (это отчасти ответ на следующий вопрос)",
                          ].map((str) => <li key={Math.random()}>{ReactHtmlParser(str)}</li>)}
                        </ul>
                      </p>
                    }
                  />

                  <CollapsibleBox
                    label='Есть завершенные задачи. Почему не отображается прогрессбар?'
                    descritpion={
                      <p>
                        Отключите фильтрацию по звездочкам. Вероятно, для выбранной сложности фич нет завершенных задач
                      </p>
                    }
                  />

                  <CollapsibleBox
                    label='Что такое AVG Speed?'
                    descritpion={
                      <p>
                        Я рад, что ты спросил(а). Это коэффициент средней скорости (Average Speed coeff), который косвенно отображает эффективность данного исполнителя.
                      </p>
                    }
                  />

                  <CollapsibleBox
                    label='Что такое Distribution function?'
                    descritpion={
                      <>
                        <p>
                          Функция распределения данных статистики. Иными словами, проекция накопленного опыта на конкретный кейс, то есть, в нашем случае, варианты развития тестируемого диапазона между выбранными датами.
                        </p>
                        <p>
                          Привожу оригинал перевода:
                        </p>
                        <p>
                          Система называется «Доказательное планирование» или ДП. Подход сводится к тому, что на основе анализа статистики выполненных работ собираются доказательства, которые потом используются для построения плана на будущее. В результате вы получаете не просто дату выпуска продукта, а и доверительную кривую распределения вероятностей завершения работ в каждый заданный срок. Выглядит она следующим образом
                        </p>
                        <p>
                          <img src='https://habrastorage.org/r/w1560/storage2/489/9d1/1cd/4899d11cd5fef518fe9c221c3efbf690.png' alt='img' style={{ width: '100%' }} />
                        </p>
                        <p>
                          Чем круче кривая, тем более реалистична конкретная дата завершения проекта. <a href='https://habr.com/ru/articles/186410/' target='_blank'>Ссылка на русский перевод</a>
                        </p>
                      </>
                    }
                  />

                  <CollapsibleBox
                    label='Зачем два календаря в левой панели?'
                    descritpion={
                      <p>
                        Чтоб быстро прикинуть дату на этапе выбора исполнителя. TODO: планируется еще фильтр "по рангу" AVG эффективности для сортировки.
                      </p>
                    }
                  />

                  <CollapsibleBox
                    label='Как выключить фильтр на мобилке?'
                    descritpion={
                      <p style={{ marginBottom: 0 }}>
                        Зайдите в боковое меню и сверните открытую секцию для исполнителя <b>{props.activeEmployee}</b>
                      </p>
                    }
                  />
                  
                </Note>
              </Block>
            </FlexColumn>

            <>
              <StickyBottom>
                <StickyH2
                  label='Feedback'
                  // Icon={<i className="far fa-comment" />}
                  Icon={<ChatBubbleOutlineIcon />}
                />
                <Block
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <Btn
                    color='primary'
                    onClick={() => {
                      // @ts-ignore
                      if (typeof window !== 'undefined') window.open('/', '_self').focus()
                    }}
                    // style={{ minWidth: '60px' }}
                  >
                    {/* <i className="fa fa-home" /> */}
                    Home
                    {/* <i className="fas fa-arrow-left"></i> */}
                  </Btn>
                  <Btn
                    color='primary'
                    onClick={() => {
                      // @ts-ignore
                      if (typeof window !== 'undefined') window.open('https://pravosleva.pro/express-helper/chat/#/chat?room=team-scoring-2019', '_blank').focus()
                    }}
                    // style={{ minWidth: '86px' }}
                  >
                    {/* <i className="fa fa-comment"/> */}
                    Feedback
                  </Btn>
                  <Btn
                    color='primary'
                    onClick={() => {
                      // @ts-ignore
                      if (typeof window !== 'undefined') window.open('https://t.me/bash_exp_ru/55', '_blank').focus()
                    }}
                    // style={{ minWidth: '86px' }}
                  >
                    {/* <i className="fab fa-telegram-plane"></i> */}
                    TG
                    {/* <TelegramIcon fontSize='small' style={{ margin: 0, padding: 0 }} /> */}
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
  )
})
