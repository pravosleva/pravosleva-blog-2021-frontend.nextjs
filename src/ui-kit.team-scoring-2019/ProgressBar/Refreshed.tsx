import React, { useState, useEffect, useRef, useCallback } from "react"
import { ProgressBar as BaseProgressBar } from "./Base"
import { getCurrentPercentage } from "~/ui-kit.team-scoring-2019/utils/scoring/getCurrentPercentage"

type TProps = {
  targetDate: number;
  startDate: number;
}

export const ProgressBar = ({ targetDate, startDate }: TProps) => {
  const [value, setValue] = useState(
    getCurrentPercentage({
      targetDate,
      startDate,
    }),
  )
  const timeout = useRef<NodeJS.Timeout>()
  const updateValue = useCallback(() => {
    const newVal = getCurrentPercentage({
      targetDate,
      startDate,
    })
    setValue(newVal)
  }, [targetDate, startDate])

  useEffect(() => {
    timeout.current = setTimeout(updateValue, 1000)

    return () => {
      if (!!timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [targetDate, startDate, value])

  return <BaseProgressBar value={value} label={`${value.toFixed(0)} %`} />
}
