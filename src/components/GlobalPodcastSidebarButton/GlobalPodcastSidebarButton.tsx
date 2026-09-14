import React, { useMemo } from 'react'
import { useAudioPodcast } from '../../store/reactive-engine/audio-podcast/hooks'
import clsx from 'clsx'
import liveStatusBadgeStyles from '~/components/GlobalAudioPlayer/components/LiveStatusBadge/LiveStatusBadge.module.scss'
import { event } from '~/utils/googleAnalitycs'
import HeadphonesIcon from '@mui/icons-material/Headphones'
import CloseIcon from '@mui/icons-material/Close'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { getFabTriggerTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'

export const GlobalPodcastSidebarButton = () => {
  const { 
    queue, 
    isPlayerVisible, 
    isPlayerMinimized, 
    setPlayerVisible, 
    setPlayerMinimized, 
    isPlaying,
    currentTime,
    duration,
    currentTrack,
    trackErrors,
    isBuffering,
    isCurrentTrackLiveStream,
  } = useAudioPodcast()

  // Декларативно вычисляем процент прогресса на основе сигналов сервиса
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  // Параметры для идеального SVG-круга 46x46
  const radius = 20
  const strokeDasharray = 2 * Math.PI * radius
  const strokeDashoffset = strokeDasharray - (progressPercent / 100) * strokeDasharray

  // Логика клика по FAB-кнопке
  const handleFabClick = () => {
    event({
      action: 'player_fab_click', // Название события для GA4
      params: {
        action_name: 'Player Fab clicked',
        count: 1,
      }
    });

    if (!isPlayerVisible) {
      setPlayerVisible(true)
      setPlayerMinimized(false)
    } else if (isPlayerMinimized) {
      setPlayerMinimized(false)
    } else {
      setPlayerVisible(false)
    }
  }

  // Флаг: показывать ли круговой прогресс (только если плеер активен И свернут)
  // const showCircularProgress = isPlayerVisible && isPlayerMinimized

  // Показываем круговой прогресс, только если плеер активен и свернут в шторку
  // const showCircularProgress = isPlayerVisible && isPlayerMinimized && progressPercent > 0
  const showCircularProgress = progressPercent > 0
  const currentTrackErrorReason = currentTrack ? trackErrors[currentTrack.id] : null;

  const liveStatus = useMemo<'ok' | 'buffering' | 'error' | 'idle'>(() => {
    switch (true) {
      case !currentTrack:
        return 'idle' // Радио на паузе
      case !!currentTrack && !!trackErrors[currentTrack.id]:
        // Если по текущему активному треку радио зафиксирован текстовый лог ошибки
        return 'error'
      case isBuffering:
        // Если идет процесс ожидания байт из сети
        return 'buffering'
      case isPlaying:
        // Если поток успешно воспроизводится без сбоев
        return 'ok'
      case !currentTrack:
      default:
        return 'idle' // Радио на паузе
    }
  }, [currentTrack, isPlaying, isBuffering, trackErrors])

  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  // const infoToolBgColor = getInfoToolBgColor({ currentTheme })
  const textColor = getFabTriggerTextColor({ currentTheme })

  // ИСПРАВЛЕНО: Кнопка должна рендериться ВСЕГДА, если в очереди есть треки!
  if (queue.length === 0) return null

  return (
    <div 
      className="mobile-podcast-fab-trigger"
      style={{
        // backgroundColor: infoToolBgColor,
        color: textColor,
      }}
      onClick={handleFabClick}
    >
      {/* Круговой SVG прогресс-бар */}
      {/* ИСПРАВЛЕНО: SVG центрирован идеально через абсолютные координаты и transform */}
      {showCircularProgress && !isCurrentTrackLiveStream && (
        <svg 
          style={{ 
            position: 'absolute', 
            width: '46px', 
            height: '46px', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%) rotate(-90deg)', // Добавили поворот на -90 градусов, чтобы прогресс начинался строго СВЕРХУ круга
            zIndex: 1 
          }}
        >
          {/* Фоновый полупрозрачный круг */}
          <circle cx="23" cy="23" r={radius} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
          {/* Активный оранжевый круг прогресса */}
          <circle
            className="svg-profile-circle"
            cx="23"
            cy="23"
            r={radius}
            fill="transparent"
            stroke="#FF8E53"
            strokeWidth="2.5"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }} // Плавное движение ободка
          />
        </svg>
      )}

      {/* Иконка внутри кнопки */}
      <div
        style={{
          zIndex: 2, fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {
          isBuffering
          ? (
            <span className={clsx(liveStatusBadgeStyles.statusDot, liveStatusBadgeStyles['statusDot--buffering'])} />
          )
          : (isPlayerVisible && !isPlayerMinimized)
            ? <CloseIcon fontSize='small' style={{ color: '#ff4d4d' }} /> /* <span style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.1em' }}>✕</span> */
            : isPlaying
              ? currentTrackErrorReason
                ? <span className={clsx(liveStatusBadgeStyles.statusDot, liveStatusBadgeStyles['statusDot--error'])} />
                : isCurrentTrackLiveStream
                  ? (
                    <span 
                      className={clsx(liveStatusBadgeStyles.statusDot, {
                        [liveStatusBadgeStyles['statusDot--ok']]: liveStatus === 'ok',
                        [liveStatusBadgeStyles['statusDot--buffering']]: liveStatus === 'buffering',
                        [liveStatusBadgeStyles['statusDot--error']]: liveStatus === 'error',
                        [liveStatusBadgeStyles['statusDot--idle']]: liveStatus === 'idle',
                      })} 
                    />
                  )
                  : <span className="rotating-disk-mobile">💿</span>
              :  <HeadphonesIcon fontSize='small' /> /* <span>🎧</span> */
        }
      </div>
    </div>
  )
}
