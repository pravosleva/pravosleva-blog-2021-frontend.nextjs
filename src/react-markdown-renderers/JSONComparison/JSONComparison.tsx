import { useMemo } from 'react'
import { getJSONDiffs } from '~/utils/getJSONDiffs'
import { useStyles } from './styles'

type TProps = {
  json1: any
  json2: any
}

function isValidJson(str: string): boolean {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const JSONComparison = ({ json1, json2 }: TProps) => {
  const classes = useStyles()
  const arePropsValid = useMemo(() => isValidJson(json1) && isValidJson(json2), [json1, json2])
  const parsed1 = useMemo(() => JSON.parse(json1), [json1])
  const parsed2 = useMemo(() => JSON.parse(json2), [json2])

  const diffs = useMemo(() => getJSONDiffs(parsed1, parsed2), [parsed1, parsed2])
  const showDiffs = useMemo(() => Object.keys(diffs).length > 0, [diffs])

  if (!arePropsValid) return <div>INVALID PROPS!</div>
  return (
    <div className={classes.wrapper}>
      <h3>json1</h3>
      <pre>{JSON.stringify(parsed1, null, 2)}</pre>
      <h3>json2</h3>
      <pre>{JSON.stringify(parsed2, null, 2)}</pre>
      {showDiffs && (
        <>
          <h3>diffs</h3>
          <pre>{JSON.stringify(diffs, null, 2)}</pre>
        </>
      )}
    </div>
  )
}
