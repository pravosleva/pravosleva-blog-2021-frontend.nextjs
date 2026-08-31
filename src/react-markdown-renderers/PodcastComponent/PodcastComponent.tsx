import React, { useMemo, useState, useEffect } from 'react' // Добавили useState и useEffect

import { ErrorBoundary } from 'react-error-boundary'
import { useAudioPodcast } from '~/store/reactive-engine/audio-podcast/hooks';
import { ErrorFallback } from '~/mui/ErrorFallback'
import { IRootState } from '~/store/IRootState';
import { useSelector } from 'react-redux';

type TPodcastProps = {
  url: string;
  title?: string;
  description?: string;
  bg?: string;
  durationStr?: string;
}

/* NOTE: Usage in markdown
<Podcast 
  url="/audio/episode-15.mp3" 
  title="Эпизод 15: Архитектура микросервисов" 
  description="Разбираем паттерны распределенных систем, CQRS и шины данных на практических примерах." 
  durationStr="42:15"
  bg="/covers/microservices.jpg" 
/>
*/

const PodcastCore: React.FC<TPodcastProps> = ({ url, title, description, bg, durationStr }) => {
  // Флаг монтирования в DOM браузера
  const [isMounted, setIsMounted] = useState(false)
  
  const { queue, currentTrack, isPlaying, toggleTrack, addToQueue } = useAudioPodcast()

  // Переводим флаг в true только на клиенте
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Автоматический фолбек для заголовка
  const trackTitle = useMemo(() => {
    if (title && title.trim() !== '') return title
    try {
      const decoded = decodeURIComponent(url)
      const fileName = decoded.substring(decoded.lastIndexOf('/') + 1)
      return fileName.replace(/\.(?:mp3|ogg|wav|m4a)(?:\?.*)?$/i, '') || 'Аудио-подкаст'
    } catch {
      return 'Аудио-подкаст'
    }
  }, [url, title])

  const trackObject = useMemo(() => ({ id: url, url, title: trackTitle }), [url, trackTitle])

  // Расчет состояний (на сервере они всегда будут false)
  const isCurrentActive = isMounted && currentTrack?.id === url
  const isPlayingNow = isMounted && isCurrentActive && isPlaying
  const isInQueue = isMounted && queue.some(t => t.id === url)

  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const bgImageCSS = useMemo(() => {
    switch (currentTheme) {
      case 'light': return bg
        ? `linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,.4) 100%), url(${bg})`
        : 'linear-gradient(to right, rgba(0, 0, 0, 0.88) 45%, rgba(237,237,237,1) 100%)'
      case 'gray': return bg
        ? `linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,.4) 100%), url(${bg})`
        : 'linear-gradient(to right, rgba(0, 0, 0, 0.88) 45%, rgba(237,237,237,1) 100%)'
      case 'hard-gray': return bg
        ? `linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,.4) 100%), url(${bg})`
        : 'linear-gradient(to right, rgba(0, 0, 0, 0.88) 45%, rgba(237,237,237,.1) 100%)'
      case 'dark': return bg
        ? `linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,.4) 100%), url(${bg})`
        : 'linear-gradient(to right, rgba(0, 0, 0, 0.88) 45%, rgba(255,255,255,.25) 100%)' 
      default:
        return 'linear-gradient(to right, rgba(0, 0, 0, 0.88) 45%, rgba(237,237,237,1) 100%)'
    }
  }, [currentTheme, bg])
  const borderCSS = useMemo(() => {
    if (isPlayingNow) {
      switch (currentTheme) {
        case 'light': return '2px solid rgb(255, 142, 83)'
        case 'gray': return '2px solid rgb(57, 229, 172)'
        case 'hard-gray': return '2px solid rgb(57, 229, 172)'
        case 'dark': return '2px solid rgb(255, 142, 83)'
        default: return '2px solid rgb(255, 142, 83)'
      }
    }
    return '2px solid rgba(255, 255, 255, 1)'
  }, [isPlayingNow, currentTheme])

  if (!url) return <div style={{ color: '#ff4d4d', padding: '10px' }}>⚠️ Ошибка: не указан путь (url) к аудиофайлу подкаста!</div>

  return (
    <div 
      className={`blog-podcast-card ${bg ? 'has-bg' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        marginBottom: '1.45rem',
        border: borderCSS,
        borderRadius: '24px',
        backgroundColor: bg ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
        // border: bg ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
        // backgroundImage: bg ? `linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,0.4) 100%), url(${bg})` : 'linear-gradient(to right, rgba(0, 0, 0, 0.88) 45%, rgba(0, 0, 0, 0.65) 100%)',
        backgroundImage: bgImageCSS,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        color: '#ffffff',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
      }}
    >
      <div
        style={{
          flex: 1, minWidth: 0, marginRight: '16px', zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ 
            fontSize: '0.7em', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            color: isCurrentActive ? '#FF8E53' : 'rgba(255,255,255,0.45)',
            fontWeight: 600
          }}>
            {isPlayingNow ? '🔊 Сейчас играет подкаст' : isCurrentActive ? '⏸️ На паузе' : '📻 Аудио-эпизод'}
          </span>

          {durationStr && durationStr.trim() !== '' && (
            <span style={{
              fontSize: '0.7em',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.85)'
            }}>
              ⏱️ {durationStr}
            </span>
          )}
        </div>
        
        <h4 style={{ margin: '6px 0 4px 0', fontSize: '1.1em', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {trackTitle}
        </h4>

        {description && description.trim() !== '' && (
          <p style={{ margin: '0 0 14px 0', fontSize: '0.85em', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: description ? '0' : '8px' }}>
          
          {/* ИСПРАВЛЕНО: Кнопка Play задизейблена, пока не отработал маунт */}
          <button
            disabled={!isMounted}
            onClick={() => toggleTrack(trackObject)}
            style={{
              background: isPlayingNow ? '#ff4d4d' : '#FF8E53',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '24px',
              cursor: !isMounted ? 'not-allowed' : 'pointer',
              fontSize: '0.85em',
              fontWeight: 'bold',
              transition: 'all 0.2s ease',
              opacity: !isMounted ? 0.6 : 1, // Визуально приглушаем кнопку во время SSR
              display: 'inline-flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{isPlayingNow ? '⏸' : '▶'}</span>
            <span>{isPlayingNow ? 'Пауза' : 'Слушать'}</span>
          </button>

          {/* ИСПРАВЛЕНО: Кнопка "В очередь" рендерится декларативно и тоже блокируется при SSR */}
          {!isInQueue && (
            <button
              className='backdrop-blur--lite'
              disabled={!isMounted}
              onClick={() => addToQueue(trackObject)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '24px',
                cursor: !isMounted ? 'not-allowed' : 'pointer',
                fontSize: '0.85em',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
                opacity: !isMounted ? 0.5 : 1,
                display: 'inline-flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>➕</span>
              <span>В очередь</span>
            </button>
          )}
          
          {isInQueue && (
            <span
              style={{
                fontSize: '0.85em',
                color: 'rgba(255,255,255,0.4)',
                // padding: '4px 8px',
                display: 'inline-flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>✓</span>
              <span>В очереди</span>
            </span>
          )}
        </div>
      </div>

      <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}>
        <span 
          className={isPlayingNow ? 'rotating-disk' : ''} 
          style={{ 
            fontSize: '2.4em', 
            opacity: isPlayingNow ? 1 : 0.35,
            display: 'inline-block',
            transition: 'opacity 0.3s ease'
          }}
        >
          💿
        </span>
      </div>
    </div>
  )
}

export const Podcast = (props: TPodcastProps) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <PodcastCore {...props} />
  </ErrorBoundary>
)
