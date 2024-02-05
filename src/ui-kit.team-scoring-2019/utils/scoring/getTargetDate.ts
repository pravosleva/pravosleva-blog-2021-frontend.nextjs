// import moment from 'moment'

type TProps = {
  taskList: any[];
  testDiff: number;
  testStart: number;
}

export const getTargetDate = ({ taskList, testDiff, testStart }: TProps): number => {
  const speeds = taskList.map(
    (e) =>
      (e.forecastFinishDate / 1000 - e.startDate / 1000) /
      (e.realFinishDate / 1000 - e.startDate / 1000)
  )
  const sortedSpeeds = speeds.map((v) => testDiff / v).sort((e1, e2) => e1 - e2)
  const chartData = [
    ['Time', 'Предполагаемый процент выполнения'],
    ...sortedSpeeds.map((e, i, a) => [
      new Date(e + testStart).getTime(),
      (i + 1) * (100 / a.length),
    ]),
  ]
  const lastDataElement = chartData[chartData.length - 1] // For example: ['8/25/2020', 100]
  const targetDate = new Date(lastDataElement[0]).getTime()

  return targetDate
}
