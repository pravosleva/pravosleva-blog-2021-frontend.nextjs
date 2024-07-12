import { memo, useMemo } from 'react'
import { Chart } from 'react-google-charts'
import { NEvent } from '~/components/SPSocketLab/components/ConnectedData/withSocketContext'

const options = {}

type TProps = {
  reports: NEvent.TReport[];
}

// const data = [
//   ["From", "To", "Weight"],
//   ["Brazil", "Portugal", 5],
// ]

const getStatesKey = (prev: string, next: string) => `${prev}|${next}`
const getFirstKey = (key: string): string => key.split('|')[0]
const getSecondKey = (key: string): string => key.split('|')[1]

const getModifiedData = (reports: NEvent.TReport[]): (string | number)[][] => {
  const state = new Map<string, number>()
  const res: [string, string, string | number][] = [
    ['From', 'To', 'Counter'],
  ]
  let counter = 0

  for (const report of reports) {
    switch (true) {
      case counter === reports.length - 1: // NOTE: Is last
        // NOTE: Nothing
        break
      case counter === 0: // NOTE: Is first
      default: // NOTE: Is middle
        const key = getStatesKey(report.stateValue, reports[counter + 1].stateValue)
        const val = state.get(key)
        if (typeof val === 'number') state.set(key, val + 1)
        else state.set(key, 1)
        break
    }
    counter += 1
  }

  return [...res, ...Array.from(state, ([key, value]) => [getFirstKey(key), getSecondKey(key), value])]
}

export const SankeysChart = memo(({ reports }: TProps) => {
  const modifiedData = useMemo<(string | number)[][]>(() => getModifiedData(reports), [reports])

  return (
    <Chart
      chartType='Sankey'
      width='100%'
      height='200px'
      data={modifiedData}
      options={options}
    />
  )
})
