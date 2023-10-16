import { Chart } from 'react-google-charts'
import moment from 'moment'
// import { compose, lifecycle } from "recompose"
// import { Map } from "immutable"
import { Wrapper } from './components/Wrapper'
import { TTask } from '~/components/time-scoring/types'
import { Note } from '~/ui-kit.special'

type TProps = {
  theTasks: (TTask & { startDate: number; realFinishDate: number; })[];
  testStart: any;
  testDiff: any;
  activeEmployee?: string;
}

export const DistributionFunctionGraph = ({
  // activeEmployee,
  theTasks = [],
  testStart = null,
  testDiff = null,
}: TProps) => {
  if (
    !theTasks ||
    (Array.isArray(theTasks) && theTasks.length === 0) ||
    !testDiff ||
    !testStart
  ) {
    return (
      <Note>
        <strong>Проверьте данные анализируемого исполнителя</strong>.<br />
        Required data is incorrect. Please double check this:
        <br />
        <ul>
          {(() => [
            <li key={Math.random()}>
              {theTasks ? (
                <span>
                  <code>theTasks.length</code> is{" "}
                  <em
                    style={{ color: theTasks.length === 0 ? "red" : "inherit" }}
                  >
                    {JSON.stringify(theTasks.length)}
                  </em>
                </span>
              ) : (
                <span>
                  <code>theTasks.length</code> is <em>{String(theTasks)}</em>
                </span>
              )}
            </li>,
            <li key={Math.random()}>
              <span>
                <code>!testDiff</code> is{" "}
                <em style={{ color: !testDiff ? "red" : "inherit" }}>
                  {String(Boolean(!testDiff))}
                  {!testDiff ? " - Проверьте разницу тестовых дат!" : ""}
                </em>
              </span>
            </li>,
            <li key={Math.random()}>
              <span>
                <code>!testStart</code> is{" "}
                <em style={{ color: !testStart ? "red" : "inherit" }}>
                  {String(Boolean(!testStart))}
                  {!testStart ? " - Проверьте testStart" : ""}
                </em>
              </span>
            </li>,
          ])()}
        </ul>
      </Note>
    );
  }

  const speeds = theTasks.map(
    (e) => (e.forecastFinishDate / 1000 - e.startDate / 1000) /
      (e.realFinishDate / 1000 - e.startDate / 1000),
  )
  const sortedSpeeds = speeds
    .map((v) => testDiff / v)
    .sort((e1, e2) => e1 - e2)
  const chartData = [
    ["Time", "Предполагаемый процент выполнения"],
    ...sortedSpeeds.map((e, i, a) => [
      moment(e + testStart).format("l"),
      (i + 1) * (100 / a.length),
    ]),
  ]

  return (
    <Wrapper onClick={(e: any) => e.stopPropagation()}>
      <Chart
        // chartType="LineChart"
        chartType="ScatterChart"
        data={chartData}
        options={{
          title: "Distribution function",
          curveType: "function",
          hAxis: {
            title: "When the task will be done",
          },
          vAxis: {
            title: "%",
          },
          legend: "none",
          fontName: "Montserrat",
          tooltip: {
            showColorCode: true,
            trigger: "selection",
          },
        }}
        width="100%"
        height="320px"
        legendToggle
      />
    </Wrapper>
  )
}

// export default compose(
//   lifecycle({
//     componentDidUpdate() {
//       console.log("Distridution Graphic updated")
//     },
//     shouldComponentUpdate(nextProps) {
//       const theTasksO = new Map({ ...this.props.theTasks })
//       const theTasksN = new Map({ ...nextProps.theTasks })
//       const activeEmployeeO = this.props.activeEmployee
//       const activeEmployeeN = nextProps.activeEmployee
//       const testStartO = this.props.testStart
//       const testStartN = nextProps.testStart
//       const testDiffO = this.props.testDiff
//       const testDiffN = nextProps.testDiff

//       return (
//         !theTasksO.equals(theTasksN) ||
//         activeEmployeeO !== activeEmployeeN ||
//         testStartO !== testStartN ||
//         testDiffO !== testDiffN
//       )
//     },
//   }),
// )(App)
