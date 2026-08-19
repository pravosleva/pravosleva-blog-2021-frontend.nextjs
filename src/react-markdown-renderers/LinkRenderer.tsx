import { useMemo } from 'react'
import { useAudioPodcast } from '~/components/GlobalAudioPlayer/hooks'

// export const LinkRenderer = (props: any) => (
//   // eslint-disable-next-line react/jsx-no-target-blank
//   <a href={props.href} target="_blank">
//     {props.children}
//   </a>
// )

export const LinkRenderer = (props: any) => {
  // ИСПРАВЛЕНО: Достаем title (из кавычек) и children (из скобок)
  const { href, children, title } = props
  
  const { queue, addToQueue, playTrack } = useAudioPodcast()

  // ИСПРАВЛЕНО: Корректно отрезаем query-параметры от строки, а не от массива
  const isAudio = useMemo(() => {
    if (!href || typeof href !== 'string') return false
    const cleanHref = href.split('?')[0] // Берём строку до знака '?'
    return (
      cleanHref.endsWith('.mp3') || 
      cleanHref.endsWith('.wav') || 
      cleanHref.endsWith('.m4a')
    )
  }, [href])

  // ИСПРАВЛЕНО: Безопасное извлечение названия трека и его описания
  const trackData = useMemo(() => {
    let mainTitle = 'Аудиоподкаст'
    if (typeof children === 'string') {
      mainTitle = children
    } else if (Array.isArray(children)) {
      mainTitle = children.find(item => typeof item === 'string') || mainTitle
    }

    // Формируем красивую сквозную строчку: "Подкаст 1 (Описание 1)"
    const fullDisplayTitle = title ? `${mainTitle} — ${title}` : mainTitle

    return {
      title: fullDisplayTitle,
      description: title || ''
    }
  }, [children, title])

  if (!href) return null

  // ─── СЦЕНАРИЙ 1: ЭТО ПОДКАСТ ────────────────────────────────────────
  if (isAudio) {
    const trackId = href
    const isInQueue = queue.some(t => t.id === trackId)
    const trackPayload = { id: trackId, url: href, title: trackData.title }

    return (
      <div style={{
        margin: '20px 0',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontWeight: 500, fontSize: '1.1em', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🎙️</span> {trackData.title}
          </div>
        </div>
        
        <audio src={href} controls style={{ width: '100%' }} preload="metadata" />
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => { addToQueue(trackPayload); playTrack(trackPayload); }}
            style={{ 
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', 
              background: '#FF8E53', border: 'none', color: '#fff', fontWeight: 500 
            }}
          >
            ▶ Слушать сейчас
          </button>
          <button 
            onClick={() => addToQueue(trackPayload)}
            disabled={isInQueue}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              cursor: isInQueue ? 'default' : 'pointer',
              background: isInQueue ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
              border: 'none',
              color: isInQueue ? 'rgba(255,255,255,0.3)' : '#fff'
            }}
          >
            {isInQueue ? '✓ В очереди' : '＋ Добавить в очередь'}
          </button>
        </div>
      </div>
    )
  }

  // ─── СЦЕНАРИЙ 2: ОБЫЧНАЯ ССЫЛКА ──────────────────────────────────────
  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a href={href} target="_blank" title={title}>
      {children}
    </a>
  )
}

export const SelfLinkRenderer = (props: any) => (
  // eslint-disable-next-line react/jsx-no-target-blank
  <a href={props.href} target="_self" className='truncate'>
    {props.children}
  </a>
)
