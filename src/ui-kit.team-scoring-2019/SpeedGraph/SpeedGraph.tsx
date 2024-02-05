import { Chart } from 'react-google-charts'
import moment from 'moment'
import styled from 'styled-components'
// import { compose, lifecycle } from 'recompose'
// import { Map } from 'immutable'
import { TTask } from '~/components/time-scoring/types'
import { Note } from '~/ui-kit.team-scoring-2019'

const Wrapper = styled('div')`
  /* box-shadow: 0 0 5px lightgray; */
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  > div,
  > div > div,
  > div > div > div,
  > div > div > div > div,
  > div > div > div > div > div,
  > div > div > div > div > div > svg {
    border-radius: inherit;
  }
  box-shadow: 0 0 5px lightgray;
`

type TProps = {
  activeEmployee: string;
  theTasks: (TTask & { startDate: number; realFinishDate: number; })[];
}

export const SpeedGraph = ({
  // activeEmployee,
  theTasks,
}: TProps) => {
  if (!theTasks || (Array.isArray(theTasks) && theTasks.length === 0)) {
    return <Note>Недостаточно данных для объективной статистики. <strong>theTasks</strong> is <code>{JSON.stringify(theTasks)}</code></Note>
  }

  const options = {
    title: 'Time vs. Speed comparison',
    hAxis: {
      title: 'Real Finish Date',
      // viewWindow: { min: moment(firstTime), max: moment(lastTime) },
    },
    vAxis: {
      title: 'Speed',
      // viewWindow: { min: 0, max: 15 },
    },
    legend: 'none',
    fontName: 'Montserrat',
    // trendlines: {
    //   0: {
    //     type: 'linear',
    //     color: 'green',
    //     lineWidth: 3,
    //     opacity: 0.3,
    //     showR2: true,
    //     visibleInLegend: true
    //   }
    // },
    tooltip: {
      showColorCode: true,
      trigger: 'selection',
    },
  }
  const data = [
    ['Time', 'Speed'],
    ...theTasks.map(e => (
      [
        `${moment(e.realFinishDate).format('l')}`,
        ((e.forecastFinishDate / 1000 - e.startDate / 1000) / (e.realFinishDate / 1000 - e.startDate / 1000))
      ]
    ))
    // [8, 12],
    // [4, 5.5],
    // [11, 14],
    // [4, 5],
    // [3, 3.5],
    // [6.5, 7]
  ]

  return (
    <Wrapper onClick={(e) => e.stopPropagation()}>
      <Chart
        chartType='ScatterChart'
        data={data}
        options={options}
        width='100%'
        height='320px'
        legendToggle
      />
    </Wrapper>
  )
}

// export const SpeedGraph = compose(
//   lifecycle({
//     componentDidUpdate() {
//       console.log('Speed Graphic updated')
//     },
//     shouldComponentUpdate(nextProps) {
//       const theTasksO = new Map({ ...this.props.theTasks })
//       const theTasksN = new Map({ ...nextProps.theTasks })
//       const activeEmployeeO = this.props.activeEmployee
//       const activeEmployeeN = nextProps.activeEmployee

//       return (
//         !theTasksO.equals(theTasksN)
//         || activeEmployeeO !== activeEmployeeN
//       )
//     },
//   }),
// )(App)
