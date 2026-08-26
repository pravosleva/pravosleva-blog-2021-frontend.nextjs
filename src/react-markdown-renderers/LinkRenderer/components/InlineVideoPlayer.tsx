import React from 'react'
import { useAudioPodcast } from '~/store/reactive-engine/audio-podcast/hooks'

type TVideoProps = {
  url: string
  linkText: string
  description?: string
  poster?: string // НОВОЕ: Опциональный постер
}

export const InlineVideoPlayer: React.FC<TVideoProps> = ({ url, linkText, description, poster }) => {
  const { pauseForExternalMedia } = useAudioPodcast() // Забираем метод глушения подкаста

  if (!url) return null

  return (
    <div 
      className="blog-inline-video-container"
      style={{
        marginBottom: '1.45rem',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* 1. Адаптивная обертка для видео 16:9 */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // Пропорции 16:9
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#000000',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)'
        }}
      >
        <video
          src={url}
          poster={poster} // ИСПРАВЛЕНО: Браузер автоматически отобразит эту картинку до старта видео
          controls
          playsInline
          preload="metadata"
          // ИСПРАВЛЕНО: Как только видео запускается, подкаст встает на паузу везде!
          onPlay={() => pauseForExternalMedia()} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* 2. Текстовый блок: Название (из текста ссылки) и Описание (из title) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h5 
          style={{ 
            margin: '0px', 
            // fontSize: '0.95em', 
            // fontWeight: 600,
            // color: '#ffffff',
            opacity: 0.9,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>📹</span><span>{linkText || 'Видео-материал'}</span>
        </h5>
        
        {description && description.trim() !== '' && (
          <p 
            style={{ 
              margin: 0, 
              // fontSize: '0.85em', 
              // color: 'rgba(255, 255, 255, 0.65)', 
              // lineHeight: '1.4' 
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
