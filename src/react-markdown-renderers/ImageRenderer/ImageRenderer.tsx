import { useEffect, useMemo } from 'react'
import { useAudioPodcast } from '~/components/GlobalAudioPlayer/hooks/useAudioPodcast'
import { registerGalleryItems } from '~/store/reactive-engine/reactiveGalleryEngine'

interface IProps {
  alt: string
  src: string
  title?: string
}

export const ImageRenderer = ({ alt, src, title }: IProps) => {
  // Подключаем наш инжектированный сервис подкастов через хук
  const { queue, addToQueue, playTrack } = useAudioPodcast()

  const isAudio = useMemo(() => {
    if (!src) return false
    return src.endsWith('.mp3') || src.endsWith('.wav') || src.endsWith('.m4a')
  }, [src])

  const normalizedItem = useMemo(() => ({
    src,
    original: src,
    width: 0,
    height: 0,
    tags: [],
    title: title || alt || 'Изображение',
    caption: alt || ''
  }), [src, alt, title])

  useEffect(() => {
    if (src && !isAudio) {
      const timerId = setTimeout(() => {
        registerGalleryItems([normalizedItem])
      }, 0)
      return () => clearTimeout(timerId)
    }
  }, [normalizedItem, src, isAudio])

  if (!src) return null

  // ─── СЦЕНАРИЙ: АУДИОТРЕК В MARKDOWN ─────────────────────────────────
  if (isAudio) {
    const trackId = src
    const isInQueue = queue.some(t => t.id === trackId)
    const trackPayload = { id: trackId, url: src, title: alt || title || 'Подкаст' }

    return (
      <div style={{
        margin: '20px 0',
        padding: '16px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontWeight: 500, fontSize: '1.1em' }}>🎵 {alt || 'Аудиоподкаст'}</div>
        <audio src={src} controls style={{ width: '100%' }} preload="metadata" />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => { addToQueue(trackPayload); playTrack(trackPayload); }}
            style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: '#FF8E53', border: 'none', color: '#fff' }}
          >
            ▶ Слушать сейчас
          </button>
          <button 
            onClick={() => addToQueue(trackPayload)}
            disabled={isInQueue}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '6px', 
              cursor: isInQueue ? 'default' : 'pointer',
              background: isInQueue ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              color: isInQueue ? 'rgba(255,255,255,0.4)' : '#fff'
            }}
          >
            {isInQueue ? '✓ В очереди' : '＋ Добавить в очередь'}
          </button>
        </div>
      </div>
    )
  }

  // ─── СЦЕНАРИЙ: КАРТИНКА ─────────────────────────────────────────────
  return (
    <img 
      className="small" 
      alt={alt} 
      src={src} 
      onClick={() => { /* Логика открытия сквозной галереи */ }} 
      style={{ cursor: 'pointer' }}
    />
  )
}
