import moment from 'moment'
import { useMemo, useCallback, memo } from 'react'
import InfiniteCalendar, {
  Calendar,
  withMultipleDates,
  defaultMultipleDateInterpolation,
} from 'react-infinite-calendar'
import { TTask } from '~/components/time-scoring/types'
// import { useCompare } from '~/hooks/useDeepEffect'
import { groupLog } from '~/utils/groupLog'
import styled from 'styled-components'
import {
  Block,
  Btn,
} from '~/ui-kit.special'

const Layout = styled('div').attrs({
  className: 'backdrop-blur--dark',
})`
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(0,0,0,0.7);
  z-index: 2;
`

type TProps = TTask & {
  setStartDate: any;
  setForecastFinishDate: any;
  setRealFinishDate: any;
  stepCounter: number;
  setStep: any;

  isModalOpened: boolean;
  onOpen: (_e: any) => void;
  onClose: (id: number) => (_e: any) => void;
}

export const MobileInfiniteCalendar = memo(({
  id,
  // description,
  // employee,
  // complexity,

  startDate,
  // finishDate: forecastFinishDate,
  forecastFinishDate,
  realFinishDate,

  setStartDate,
  setForecastFinishDate,
  setRealFinishDate,
  stepCounter,
  setStep,

  isModalOpened,
  onOpen,
  onClose,
}: TProps) => {

  const selectedDates = useMemo(() => {
    const arr = []

    if (startDate) arr.push(new Date(startDate))
    if (forecastFinishDate) arr.push(new Date(forecastFinishDate))
    if (realFinishDate) arr.push(new Date(realFinishDate))

    // console.log(arr)
    if (arr.length === 0) arr.push(new Date())

    return arr
  }, [startDate, forecastFinishDate, realFinishDate])

  // useEffect(() => {
  //   console.log(`- eff: selectedDates (${typeof selectedDates}; isArray: ${Array.isArray(selectedDates)})`)
  //   console.log(selectedDates)

  //   console.log({
  //     startDate,
  //     forecastFinishDate,
  //     realFinishDate,

  //     setStartDate,
  //     setForecastFinishDate,
  //     setRealFinishDate,
  //     stepCounter,
  //     setStep,
  //   })
  // }, [useCompare([selectedDates])])

  const handleSelect = useCallback((e: any) => {
    (() => Promise.resolve())()
      .then(() => {
        groupLog({
          spaceName: 'InfiniteCalendar -> onSelect(event)',
          items: [
            `event (${typeof e}); instanceof Date: ${e instanceof Date}`,
            e,
            `id: ${id} (${typeof id})`,
          ],
        })

        switch (stepCounter) {
          case 0:
            return setStartDate(
              new Date(e).getTime(),
              id,
            )
          case 1:
            return setForecastFinishDate(
              new Date(e).getTime(),
              id,
            )
          case 2:
            return setRealFinishDate(
              new Date(e).getTime(),
              id,
            )
          default:
            return []
        }
      })
      .then(() => setStep())
      .catch(console.warn)
  }, [id, setStartDate, setForecastFinishDate, setRealFinishDate, setStep])

  const theme = useMemo(() => {
    return {
      /*
      {
        accentColor?: string | undefined;
        floatingNav?: {
            background?: string | undefined;
            chevron?: string | undefined;
            color?: string | undefined;
        } | undefined;
        headerColor?: string | undefined;
        textColor?: {
            active?: string | undefined;
            default?: string | undefined;
        } | undefined;
        todayColor?: string | undefined;
        weekdayColor?: string | undefined;
      } | undefined;
      */
      selectionColor: (date: any) => {
        // console.log(date, typeof date)
        switch (moment(date).valueOf()) {
          case startDate:
            return '#EC6150'
          case forecastFinishDate:
            return 'lightgray'
          case realFinishDate:
            return 'rgb(68, 138, 255)'
          default:
            return 'gray'
        }
      },
      floatingNav: {
        background: 'rgba(68, 138, 255, 0.5)',
        color: '#FFF',
        chevron: 'transparent',
      },
    }
  }, [])

  return (
    <>
      {
        isModalOpened ? (
          <Layout>
            {/* @ts-ignore */}
            <InfiniteCalendar
              Component={withMultipleDates(Calendar)}
              // theme={infiniteCalendarTheme}
              theme={theme}
              width={window.innerWidth}
              // height={window.innerHeight / 2.5}
              height={250}
              selected={selectedDates}
              onSelect={handleSelect}
              // @ts-ignore
              interpolateSelection={
                defaultMultipleDateInterpolation
              }
            />
            <Block style={{ marginTop: '16px' }}>
              <Btn onClick={onClose(id)} fullWidth color='primary'>Ok</Btn>
            </Block>
          </Layout>
        ) : (
          <Block>
            <Btn onClick={onOpen} fullWidth color='primary'>Open</Btn>
          </Block>
        )
      }
    </>
  )
})
