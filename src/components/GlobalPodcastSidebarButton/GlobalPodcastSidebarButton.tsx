import React, { useEffect, useMemo, useState } from 'react'
import { useAudioPodcast } from '../../store/reactive-engine/audio-podcast/hooks'
import clsx from 'clsx'
import liveStatusBadgeStyles from '~/components/GlobalAudioPlayer/components/LiveStatusBadge/LiveStatusBadge.module.scss'

export const GlobalPodcastSidebarButton = () => {
  // const { queue, isPlayerVisible, isPlayerMinimized, setPlayerVisible, setPlayerMinimized, currentTrack } = useAudioPodcast()
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
  // const [progressPercent, setProgressPercent] = useState(0)
  // const [isPlaying, setIsPlaying] = useState(false)

  // Отслеживаем прогресс аудио для SVG-круга
  // useEffect(() => {
  //   const checkAudioElement = () => {
  //     const audioEl = document.querySelector('.blog-audio-player-container audio') as HTMLAudioElement
  //     if (audioEl) {
  //       const updateProgress = () => {
  //         if (audioEl.duration) {
  //           setProgressPercent((audioEl.currentTime / audioEl.duration) * 100)
  //         }
  //         setIsPlaying(!audioEl.paused)
  //       }
  //       audioEl.addEventListener('timeupdate', updateProgress)
  //       audioEl.addEventListener('play', updateProgress)
  //       audioEl.addEventListener('pause', updateProgress)
        
  //       return () => {
  //         audioEl.removeEventListener('timeupdate', updateProgress)
  //         audioEl.removeEventListener('play', updateProgress)
  //         audioEl.removeEventListener('pause', updateProgress)
  //       }
  //     }
  //   }

  //   const timer = setTimeout(checkAudioElement, 250)
  //   return () => clearTimeout(timer)
  // }, [isPlayerVisible, currentTrack?.id])

  // ИСПРАВЛЕНО: Кнопка должна рендериться ВСЕГДА, если в очереди есть треки!
  if (queue.length === 0) return null

  // Расчет кругового прогресса для SVG (2 * pi * 18 = 113.09)
  // ИСПРАВЛЕНО: Оптимальные параметры круга для SVG 46x46 пикселей.
  // Центр строго в точке 23, радиус 20. Длина окружности = 2 * pi * 20 = 125.66
  // const radius = 20
  // const strokeDasharray = 2 * Math.PI * radius
  // const strokeDashoffset = strokeDasharray - (progressPercent / 100) * strokeDasharray

  // ИСПРАВЛЕНО: Декларативно вычисляем процент прогресса на основе сигналов сервиса
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  // Параметры для идеального SVG-круга 46x46
  const radius = 20
  const strokeDasharray = 2 * Math.PI * radius
  const strokeDashoffset = strokeDasharray - (progressPercent / 100) * strokeDasharray

  // Логика клика по FAB-кнопке
  // const handleFabClick = () => {
  //   if (!isPlayerVisible) {
  //     // Если плеер был совсем закрыт — открываем его в развернутом виде
  //     setPlayerVisible(true)
  //     setPlayerMinimized(false)
  //   } else if (isPlayerMinimized) {
  //     // Если шторка была свернута — разворачиваем её
  //     setPlayerMinimized(false)
  //   } else {
  //     // Если шторка уже открыта — жесткий триггер закрытия (скрываем плеер полностью)
  //     setPlayerVisible(false)
  //   }
  // }
  const handleFabClick = () => {
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

  return (
    <div 
      className="mobile-podcast-fab-trigger"
      onClick={handleFabClick}
      // style={{
      //   position: 'fixed',
      //   left: '20px', // Слева по ТЗ
      //   bottom: '20px',
      //   width: '48px',
      //   height: '48px',
      //   borderRadius: '50%',
      //   backgroundColor: '#111111',
      //   border: '1px solid rgba(255, 255, 255, 0.15)',
      //   boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      //   zIndex: 2100, // Поверх шторки
      //   cursor: 'pointer',
      //   display: 'none', // Включается медиа-запросом в CSS на мобилках
      //   alignItems: 'center',
      //   justifyContent: 'center',
      //   userSelect: 'none',
      //   WebkitTapHighlightColor: 'transparent',
      // }}
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
      <div style={{ zIndex: 2, fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {
          isBuffering
          ? (
            <span 
              className={clsx(liveStatusBadgeStyles.statusDot, liveStatusBadgeStyles['statusDot--buffering'])} 
            />
          )
          : isPlayerVisible && !isPlayerMinimized
          ? <span style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '1.1em' }}>✕</span>
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
                    })} 
                  />
                )
                : <span className="rotating-disk-mobile">💿</span>
            : currentTrackErrorReason
              ? <span className={clsx(liveStatusBadgeStyles.statusDot, liveStatusBadgeStyles['statusDot--error'])} />
              : <span>🎧</span>
        }
      </div>
    </div>
  )
}
