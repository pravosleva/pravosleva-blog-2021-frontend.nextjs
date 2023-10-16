import { useMemo } from 'react'
import Chart from 'react-google-charts'
import styled from 'styled-components'
import { generateColor } from '~/ui-kit.special/utils/generateColor'
import { useCompare } from '~/hooks/useDeepEffect'
import { TTask } from '~/components/time-scoring/types'

const Wrapper = styled('div')`
  width: 100%;
  margin: 0 auto;

  @media (max-width: 767px) {
  }
  @media (min-width: 768px) {
    max-width: 900px;
    box-shadow: rgba(51, 51, 51, 0.2) 0px 0px 4px;

    border-radius: 10px;
    > div,
    > div > div,
    > div > div > div,
    > div > div > div > div,
    > div > div > div > div > div,
    > div > div > div > div > div > svg {
      border-radius: inherit;
    }
  }
`

// See also about options:
// https://developers.google.com/chart/interactive/docs/gallery/columnchart
const pieOptions = {
  title: '',
  pieHole: 0.6,
  // slices: [
  //   { color: '#2BB673' },
  //   { color: '#d91e48' },
  //   { color: '#007fad' },
  //   { color: '#e9a227' },
  // ],
  slices: generateColor('#62b2d0', '#1b7bff', 10).map((c) => ({ color: c })),
  legend: {
    position: 'right',
    alignment: 'center',
    textStyle: {
      color: '233238',
      fontSize: 14,
    },
  },
  tooltip: {
    showColorCode: true,
    trigger: 'selection',
  },
  chartArea: {
    left: 0,
    top: 20,
    width: '100%',
    height: '85%',
  },
  fontName: 'Montserrat',
  is3D: true,
}

// export declare type ReactGoogleChartEvent = {
//   eventName: GoogleVizEventName;
//   callback: (eventCallbackArgs: {
//       chartWrapper: GoogleChartWrapper;
//       controlWrapper?: GoogleChartControl;
//       props: ReactGoogleChartProps;
//       google: GoogleViz;
//       eventArgs: any;
//   }) => void;
// };

// const chartEvents = [
//   {
//     // eventName: "select",
//     // callback({ chartWrapper }) {
//     //   console.log("Selected ", chartWrapper.getChart().getSelection());
//     // },
//     eventName: 'select',
//     callback: (event: any) => {
//       console.log(event.chartWrapper)
//     },
//   },
// ]



type TProps = {
  taskList: TTask[];
}

export const Pie = ({ taskList }: TProps) => {
  const uniqueItems = useMemo(() => {
    return taskList.reduce((acc: { [key: string]: number }, cur) => {
      if (!!acc[cur.employee]) acc[cur.employee] += 1
      else acc[cur.employee] = 1
      return acc
    }, {})
  }, [useCompare([taskList])])
  return (
    <Wrapper>
      <Chart
        chartType="PieChart"
        graphID="ScatterChart"
        // data={[['Age', 'Weight'], ['a', 12], ['b', 5.5]]}
        data={[
          ['Employee', 'Total'],
          ...Object.keys(uniqueItems).map((t) => [t, uniqueItems[t]]),
        ]}
        options={pieOptions}
        graph_id="PieChart"
        width="100%"
        height="300px"
        legend_toggle
        // chartEvents={chartEvents}
      />
    </Wrapper>
  )
}

