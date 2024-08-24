import { useMemo } from 'react'
// import { ThemedButton, EColorValue } from '~/common/styled-mui/custom-button'
import { useStyles } from './styles'
import clsx from 'clsx'
import { isValidJson } from '~/utils/isValidJson'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { withTranslator } from '~/hocs/withTranslator'
// import { SelfLinkRenderer } from '~/react-markdown-renderers/LinkRenderer'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

enum EControlType {
  Link = 'link',
}

type TControl = {
  title: string;
  label: string;
  type: EControlType;
  link: string;
  variant?: 'contained' | 'filled';
}

// interface IProps {
//   controlsJson: string
// }

export const ControlsBox = withTranslator<any>(({ controlsJson, t }) => {
  const styles = useStyles()
  const arePropsValid = useMemo(() => isValidJson(controlsJson), [controlsJson])
  const normalizedControls = useMemo<TControl[]>(() => JSON.parse(controlsJson), [controlsJson])

  // const openLinlInCurrentTab = ({ link }: { link: string }) => () => {
  //   window.open(link)
  // }

  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const linkColor = useMemo(() => {
    return (
      currentTheme === 'hard-gray'
        ? '#fff'
        : currentTheme === 'dark'
          ? '#fff' : '#0162c8'
    )
  }, [currentTheme])
  const bgBlurClassName = useMemo(() => {
    return (
      currentTheme === 'hard-gray'
        ? 'backdrop-blur--subdark'
        : currentTheme === 'dark'
          ? 'backdrop-blur--lite' : 'backdrop-blur--lite'
    )
  }, [currentTheme])
  if (!controlsJson) return <div>ERR: Incorrect props</div>
  if (!arePropsValid) return <div>ERR: Incorrect json</div>

  return (
    // @ts-ignore
    <div className={clsx(styles.wrapper)}>
      {normalizedControls.map(({
        label,
        link,
        // variant,
        title,
      }, i, a) => {
        const isFirst = i === 0
        const isLast = i === a.length - 1

        const isPrevBtn = title === 'PREV'
        const isNextBtn = title === 'NEXT'
        const StartIcon = isPrevBtn
          ? <KeyboardArrowLeftIcon />
          : null
        const EndIcon = isNextBtn
          ? <KeyboardArrowRightIcon />
          : null

        return !!link ? (
          // <SelfLinkRenderer
          //   key={`${link}-${i}`}
          //   // color={EColorValue.redNoShadow}
          //   // variant={variant || 'contained'}
          //   // onClick={openLinlInCurrentTab({ link })}
          //   href={link}
          // >
          //   {label}
          // </SelfLinkRenderer>
          <a
            key={`${link}-${i}`}
            className={bgBlurClassName}
            style={{
              color: linkColor,
              display: 'flex',
              flexDirection: 'column',
              alignItems: isFirst
                ? 'flex-start'
                : isLast
                  ? 'flex-end'
                  : 'center',
              gap: '8px',
              textDecoration: 'none',
              // border: '1px solid red',
              width: '100%',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 3px 7px -1px rgba(0, 0, 0, .1)',
            }}
            href={link}
          >
            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {StartIcon}
              <b>{t(title)}</b>
              {EndIcon}
            </span>
            <span style={{ textAlign: isLast ? 'right' : 'left' }}>{label}</span>
          </a>
        ) : (
          <div key={String(i)}>ERR: Incorrect link</div>
        )
      })}
    </div>
  )
})
