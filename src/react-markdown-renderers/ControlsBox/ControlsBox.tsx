import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import { IRootState } from '~/store/IRootState'
import { useStyles } from './styles'

// Импорты иконок MUI
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import TelegramIcon from '@mui/icons-material/Telegram'
import TabIcon from '@mui/icons-material/Tab'
import DriveEtaIcon from '@mui/icons-material/DriveEta'
import GitHubIcon from '@mui/icons-material/GitHub'
import { withTranslator } from '~/hocs/withTranslator'

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

// Предполагаем реализацию функции проверки валидности
const isValidJson = (str: string): boolean => {
  try { JSON.parse(str); return true; } catch (e) { return false; }
}

export const ControlsBox = withTranslator<any>(({ controlsJson, t }) => {
  const styles = useStyles()
  const arePropsValid = useMemo(() => isValidJson(controlsJson), [controlsJson])
  
  // 🔥 ЗАЩИТА СЕТКИ: Фильтруем пустые или битые ссылки на уровне подготовки данных, 
  // чтобы они не плодили лишние узлы в Grid-контейнере и не ломали селекторы чётности
  const normalizedControls = useMemo<TControl[]>(() => {
    if (!arePropsValid || !controlsJson) return []
    const parsed: TControl[] = JSON.parse(controlsJson)
    return Array.isArray(parsed) ? parsed.filter(item => !!item?.link) : []
  }, [controlsJson, arePropsValid])

  if (!controlsJson) return <div style={{ color: 'red', fontWeight: 'bold' }}>ERR: Missing props</div>
  if (!arePropsValid) return <div style={{ color: 'red', fontWeight: 'bold' }}>ERR: Incorrect json</div>
  if (normalizedControls.length === 0) return null

  return (
    <div className={clsx(styles.wrapper, 'controls-box')}>
      {normalizedControls.map(({ label, link, title }, i) => {
        
        let StartIcon = null
        switch (title) {
          case 'PREV': StartIcon = <ArrowBackIcon fontSize='small' />; break
          case 'START_PLAY':
          case 'START_DEMO': StartIcon = <PlayArrowIcon fontSize='small' />; break
          case 'START_CHAT': StartIcon = <ChatBubbleIcon fontSize='small' />; break
          case 'START_TELEGRAM': StartIcon = <TelegramIcon fontSize='small' />; break
          case 'START_NEW_TAB': StartIcon = <TabIcon fontSize='small' />; break
          case 'START_DRIVE2': StartIcon = <DriveEtaIcon fontSize='small' />; break
          case 'START_GITHUB': StartIcon = <GitHubIcon fontSize='small' />; break
          default: break
        }

        let EndIcon = null
        switch (title) {
          case 'NEXT': EndIcon = <ArrowForwardIcon fontSize='small' />; break
          case 'END_PLAY':
          case 'END_DEMO': EndIcon = <PlayArrowIcon fontSize='small' />; break
          case 'END_CHAT': EndIcon = <ChatBubbleIcon fontSize='small' />; break
          case 'END_TELEGRAM': EndIcon = <TelegramIcon fontSize='small' />; break
          case 'END_NEW_TAB': EndIcon = <TabIcon fontSize='small' />; break
          case 'END_DRIVE2': EndIcon = <DriveEtaIcon fontSize='small' />; break
          case 'END_GITHUB': EndIcon = <GitHubIcon fontSize='small' />; break
          default: break
        }

        const isExternalLink = [
          'START_NEW_TAB', 'START_DRIVE2', 'END_NEW_TAB', 'END_DRIVE2', 'START_GITHUB', 'END_GITHUB'
        ].includes(title)

        return (
          <a
            key={`${link}-${i}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              textDecoration: 'none',
              width: '100%',
              padding: '16px',
              boxSizing: 'border-box'
            }}
            href={link}
            target={isExternalLink ? '_blank' : '_self'}
          >
            {/* Ряд с иконками и текстом кнопки */}
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
              <b style={{ fontFamily: 'Montserrat' }}>{t(title)}</b>
              {EndIcon}
            </span>
            
            {/* Описание под кнопкой */}
            <span>{label}</span>
          </a>
        )
      })}
    </div>
  )
})
