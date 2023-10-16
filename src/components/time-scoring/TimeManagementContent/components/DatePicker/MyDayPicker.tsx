import { memo } from 'react'
import DayPicker from 'react-day-picker'
import styled from 'styled-components'

const Wrapper = styled('div')`
  // border: 1px dashed red;

  // position: sticky;
  // bottom: 0px;

  // border-radius: 20px;
  > div,
  > div > div {
    border-radius: inherit;
  }
`

// shouldComponentUpdate(nextProps, nextState) {
//   // COMPARE: this.props.selectedDays | nextProps.selectedDays
//   const test1 = new Map({ ...this.props.selectedDays })
//   const test2 = new Map({ ...nextProps.selectedDays })

//   return !test1.equals(test2)
// }

type TProps = {
  selectedDays: any;
  onDayClick: any;
}

export const MyDayPicker = memo(({ selectedDays, onDayClick }: TProps) => {
  return (
    <Wrapper>
      {/* @ts-ignore */}
      <DayPicker
        // @ts-ignore
        style={{
          borderRadius: 'inherit',
        }}
        showOutsideDays
        // className="Selectable"
        // numberOfMonths={1}
        selectedDays={selectedDays}
        // modifiers={modifiers}
        // onDayClick={(day) => console.log(day)}
        onDayClick={onDayClick}
        // modifiers={{
        //   highlighted: new Date((() => {
        //     const obj = props.testDates.filter((e) => Object.keys(e).includes(employee))[0];
        //
        //     if (obj && obj[employee]) { return moment(obj[employee].startDate).valueOf(); }
        //     return moment().valueOf();
        //   })()),
        // }}
      />
    </Wrapper>
  )
})
