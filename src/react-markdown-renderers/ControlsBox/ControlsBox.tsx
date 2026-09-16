import { useMemo } from 'react'
import { useStyles } from './styles'
import clsx from 'clsx'
import { isValidJson } from '~/utils/isValidJson'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { withTranslator } from '~/hocs/withTranslator'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import TelegramIcon from '@mui/icons-material/Telegram'
import TabIcon from '@mui/icons-material/Tab'
import DriveEtaIcon from '@mui/icons-material/DriveEta'
import GitHubIcon from '@mui/icons-material/GitHub'

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

export const ControlsBox = withTranslator<any>(({ controlsJson, t }) => {
  const styles = useStyles()
  const arePropsValid = useMemo(() => isValidJson(controlsJson), [controlsJson])
  const normalizedControls = useMemo<TControl[]>(() => JSON.parse(controlsJson), [controlsJson])

  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  if (!controlsJson) return <div>ERR: Incorrect props</div>
  if (!arePropsValid) return <div>ERR: Incorrect json</div>

  return (
    // @ts-ignore
    <div className={clsx(styles.wrapper, 'controls-box')}>
      {normalizedControls.map(({
        label,
        link,
        // variant,
        title,
      }, i, a) => {
        const isFirst = i === 0
        const isLast = i === a.length - 1

        let StartIcon = null
        switch (true) {
          case title === 'PREV':
            StartIcon = <ArrowBackIcon fontSize='small' />
            break
          case title === 'START_PLAY':
          case title === 'START_DEMO':
            StartIcon = <PlayArrowIcon fontSize='small' />
            break
          case title === 'START_CHAT':
            StartIcon = <ChatBubbleIcon fontSize='small' />
            break
          case title === 'START_TELEGRAM':
            StartIcon = <TelegramIcon fontSize='small' />
            break
          case title === 'START_NEW_TAB':
            StartIcon = <TabIcon fontSize='small' />
            break
          case title === 'START_DRIVE2':
            StartIcon = <DriveEtaIcon fontSize='small' />
            break
          case title === 'START_GITHUB':
            StartIcon = <GitHubIcon fontSize='small' />
            break
          default:
            break
        }

        let EndIcon = null
        switch (true) {
          case title === 'NEXT':
            EndIcon = <ArrowForwardIcon fontSize='small' />
            break
          case title === 'END_PLAY':
          case title === 'END_DEMO':
            EndIcon = <PlayArrowIcon fontSize='small' />
            break
          case title === 'END_CHAT':
            EndIcon = <ChatBubbleIcon fontSize='small' />
            break
          case title === 'END_TELEGRAM':
            EndIcon = <TelegramIcon fontSize='small' />
            break
          case title === 'END_NEW_TAB':
            EndIcon = <TabIcon fontSize='small' />
            break
          case title === 'END_DRIVE2':
            EndIcon = <DriveEtaIcon fontSize='small' />
            break
          case title === 'END_GITHUB':
            EndIcon = <GitHubIcon fontSize='small' />
            break
          default:
            break
        }
        const isExternalLink = [
          'START_NEW_TAB',
          'START_DRIVE2',
          'END_NEW_TAB',
          'END_DRIVE2',
          'START_GITHUB',
          'END_GITHUB',
        ].some((value) => value === title)

        return !!link ? (
          <a
            key={`${link}-${i}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isFirst
                ? 'flex-start'
                : isLast
                  ? 'flex-end'
                  : 'center',
              gap: '8px',
              textDecoration: 'none',
              width: '100%',
              padding: '16px',
            }}
            href={link}
            target={isExternalLink ? '_blank' : '_self'}
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
            <span style={{ textAlign: isFirst ? 'left' : isLast ? 'right' : 'center' }}>{label}</span>
          </a>
        ) : (
          <div key={String(i)}>ERR: Incorrect link</div>
        )
      })}
    </div>
  )
})
