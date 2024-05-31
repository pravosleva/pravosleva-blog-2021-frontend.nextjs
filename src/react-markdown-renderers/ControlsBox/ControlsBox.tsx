import { useMemo, memo } from 'react'
// import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import { useStyles } from './styles'
import clsx from 'clsx'
import { isValidJson } from '~/utils/isValidJson'
import { SelfLinkRenderer } from '~/react-markdown-renderers/LinkRenderer'

enum ECode {
  Right = 'right',
  Left = 'left',
  Center = 'center',
  SpaceBetween = 'spaceBetween',
}

enum EControlType {
  Link = 'link',
}

type TControl = {
  label: string
  type: EControlType
  link: string
  variant?: 'contained' | 'filled'
}

interface IProps {
  code: ECode
  controlsJson: string
}

export const ControlsBox = memo(({ code, controlsJson }: IProps) => {
  const styles = useStyles()
  const arePropsValid = useMemo(() => isValidJson(controlsJson), [controlsJson])
  const normalizedControls = useMemo<TControl[]>(() => JSON.parse(controlsJson), [controlsJson])

  // const openLinlInCurrentTab = ({ link }: { link: string }) => () => {
  //   window.open(link)
  // }

  if (!code || !controlsJson) return <div>ERR: Incorrect props</div>
  if (!arePropsValid) return <div>ERR: Incorrect json</div>

  return (
    // @ts-ignore
    <div className={clsx(
      styles.wrapper,
      styles[`code_${code}`],
    )}>
      {normalizedControls.map(({
        label,
        link,
        // variant,
      }, i) =>
        !!link ? (
          <SelfLinkRenderer
            key={`${link}-${i}`}
            // color={EColorValue.redNoShadow}
            // variant={variant || 'contained'}
            // onClick={openLinlInCurrentTab({ link })}
            href={link}
          >
            {label}
          </SelfLinkRenderer>
        ) : (
          <div key={String(i)}>ERR: Incorrect link</div>
        )
      )}
    </div>
  )
})
