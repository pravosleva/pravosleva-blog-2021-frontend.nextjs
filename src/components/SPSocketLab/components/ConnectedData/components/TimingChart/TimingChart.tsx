import { memo, useMemo } from 'react'
import { Chart } from 'react-google-charts'
import { NEvent } from '~/components/SPSocketLab/components/ConnectedData/withSocketContext'

const options = {
  timeline: {
    // showRowLabels: false,
    groupByRowLabel: true,
  },
  avoidOverlappingGridLines: false,
}

type TProps = {
  report: NEvent.TReport | null;
}

export const TimingChart = memo(({ report }: TProps) => {
  const modifiedData = useMemo(() => {
    return !!report?._wService?._perfInfo
      ? report?._wService?._perfInfo.tsList.map((item, i, arr) => ([
        'Delta',
        `${item.name} (${item.ts})`,
        i === 0
          ? new Date(item.ts)
          : new Date(arr[i - 1].ts),
        i === 0
          ? new Date(arr[i + 1].ts)
          : new Date(item.ts),
      ]))
      : []
  }, [report])
  const chartData = useMemo(() => {
    return [
      [
        { type: 'string', id: 'TimeRangeDescr' },
        { type: 'string', id: 'EventDescr' },
        { type: 'date', id: 'Start' },
        { type: 'date', id: 'End' },
      ],
      ...modifiedData,
    ]
  }, [modifiedData])
  return (
    <Chart
      chartType='Timeline'
      data={chartData}
      width='100%'
      height='200px'
      options={options}
    />
  )
})
