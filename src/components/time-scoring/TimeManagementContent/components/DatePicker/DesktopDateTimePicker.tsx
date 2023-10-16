import { memo } from 'react'
import moment from 'moment'
import { setHours, setMinutes } from 'date-fns'
import DatePicker from 'react-datepicker'
import { groupLog } from '~/utils/groupLog'

// shouldComponentUpdate(nextProps) {
//   const { selectedDate } = this.props
//   const newDate = nextProps.selectedDate

//   return selectedDate !== newDate
// }

type TProps = {
  selectedDate: any;
  setDate: (_e: any, id: number) => void;
  id: number;
  label: string;
}

export const DesktopDateTimePicker = memo(({
  selectedDate,
  setDate,
  id,
  label,
}: TProps) => {
  return (
    <DatePicker
      showMonthDropdown
      fixedHeight
      // onSelect={arg => {}}
      onChange={(arg: Date) => {
        groupLog({ spaceName: `setDate for id: ${id}`, items: [arg, new Date(arg).getTime()] })
        setDate(new Date(arg).getTime(), id)
      }}
      value={
        selectedDate
          ? `${label}: ${moment(selectedDate).format('MMM Do dd, HH:mm')}`
          : `SET ${label}`
      }
      // dateFormat='MMM Do dd, hh:mm'
      // @ts-ignore
      selected={selectedDate ? new Date(moment(selectedDate)) : null}
      // @ts-ignore
      openToDate={selectedDate ? new Date(moment(selectedDate)) : new Date(moment())}
      // TIME:
      showTimeSelect
      timeCaption="Время"
      timeFormat="HH:mm"
      timeIntervals={30}
      // @ts-ignore
      minTime={new Date(moment(setHours(setMinutes(new Date(), 0), 8)))}
      // @ts-ignore
      maxTime={new Date(moment(setHours(setMinutes(new Date(), 0), 23)))}
      // shouldCloseOnSelect={false}
      // customImput={<CustomInput />}
    />
  )
})
