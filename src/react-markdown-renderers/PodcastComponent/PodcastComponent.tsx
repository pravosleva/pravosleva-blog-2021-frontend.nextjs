import React, { useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useAudioPodcast } from '~/components/GlobalAudioPlayer/hooks';
import { ErrorFallback } from '~/mui/ErrorFallback'

type TPodcastProps = {
  url: string;
  title?: string;
  description?: string;
  bg?: string;
  durationStr?: string; // НОВОЕ: Опциональная длительность трека, заданная автором (например, "12:45")
}

/* NOTE: Usage
<Podcast 
  url="/audio/episode-15.mp3" 
  title="Эпизод 15: Архитектура микросервисов" 
  description="Разбираем паттерны распределенных систем, CQRS и шины данных на практических примерах." 
  durationStr="42:15"
  bg="/covers/microservices.jpg" 
/>
*/

const PodcastCore: React.FC<TPodcastProps> = ({ url, title, description, bg, durationStr }) => {
  const { queue, currentTrack, isPlaying, toggleTrack, addToQueue } = useAudioPodcast()

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

  // Формируем объект трека для PWA-системы
  const trackObject = useMemo(() => ({
    id: url, 
    url,
    title: trackTitle
  }), [url, trackTitle])

  const isCurrentActive = currentTrack?.id === url
  const isPlayingNow = isCurrentActive && isPlaying
  const isInQueue = queue.some(t => t.id === url)

  if (!url) return <div style={{ color: '#ff4d4d', padding: '10px' }}>⚠️ Ошибка: не указан путь (url) к аудиофайлу подкаста!</div>

  return (
    <div 
      className={`blog-podcast-card ${bg ? 'has-bg' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',

        alignItems: 'center',
        justifyContent: 'space-between',
        // padding: '16px 24px',
        padding: '16px',
        // margin: '20px 0',
        marginBottom: '1.45rem',
        borderRadius: '16px',
        backgroundColor: bg ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
        border: bg ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
        backgroundImage: bg ? `linear-gradient(to right, rgba(0,0,0,0.88) 45%, rgba(0,0,0,0.4) 100%), url(${bg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        color: '#ffffff',
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
        // Свойства transition и transform убраны отсюда в CSS-файл для чистоты и производительности
      }}
    >
      {/* Левая часть */}
      <div
        style={{
          flex: 1, minWidth: 0, marginRight: '16px', zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        
        {/* ВЕРХНЯЯ СТРОКА: Статус + Длительность трека */}
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

          {/* ИСПРАВЛЕНО: Компактный бейдж длительности подкаста */}
          {durationStr && durationStr.trim() !== '' && (
            <span style={{
              fontSize: '0.7em',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⏱️ {durationStr}
            </span>
          )}
        </div>
        
        <h4 style={{ 
          margin: '6px 0 4px 0', 
          fontSize: '1.1em', 
          fontWeight: 600,
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {trackTitle}
        </h4>

        {description && description.trim() !== '' && (
          <p style={{
            margin: '0 0 14px 0',
            fontSize: '0.85em',
            color: 'rgba(255, 255, 255, 0.7)',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {description}
          </p>
        )}

        {/* Группа кнопок */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: description ? '0' : '8px' }}>
          <button
            onClick={() => toggleTrack(trackObject)}
            style={{
              background: isPlayingNow ? '#ff4d4d' : '#FF8E53',
              color: '#ffffff',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.85em',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{isPlayingNow ? '⏸ Пауза' : '▶ Слушать'}</span>
          </button>

          {!isInQueue && (
            <button
              onClick={() => addToQueue(trackObject)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                padding: '5px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.8em',
                transition: 'all 0.2s ease'
              }}
            >
              ➕ В очередь
            </button>
          )}
          
          {isInQueue && !isCurrentActive && (
            <span style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.4)', padding: '4px 8px' }}>
              ✓ В очереди
            </span>
          )}
        </div>
      </div>

      {/* Правая часть: Анимированный диск */}
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
