import { useAudioPodcast } from '~/store/reactive-engine/audio-podcast/hooks'
import { InlineVideoPlayer } from './components'

interface LinkRendererProps {
  href?: string
  children: React.ReactNode // Текст ссылки, например [Link]
  // -- NOTE: Сюда Markdown-парсер складывает строку "Описание" из кавычек
  title?: string
  // -- UPD: Сюда приходит "Описание видеоролика | /images/video-poster.jpg"
}

export const LinkRenderer: React.FC<LinkRendererProps> = ({ href, children, title }) => {
  const { queue, currentTrack, isPlaying, toggleTrack, addToQueue, removeFromQueue, stopTrack } = useAudioPodcast()
  // 1. Регулярное выражение для детекции видеофайлов (mp4, webm, mov, avi)
  const isVideoLink = !!href && /\.(?:mp4|webm|mov|avi)(?:\?.*)?$/i.test(href)
  
  // Регулярное выражение для аудио-подкастов (сохраняем прошлую логику)
  const isAudioLink = !!href && /\.(?:mp3|wav|ogg|m4a)(?:\?.*)?$/i.test(href)

  // Получаем чистый текст ссылки в виде строки
  const linkText = typeof children === 'string' ? children : 'Смотреть видео'

  // ИСПРАВЛЕНО: Извлекаем описание и опциональный постер из единой строки title
  let cleanDescription = title
  let posterUrl: string | undefined = undefined

  if (title && title.includes('|')) {
    const parts = title.split('|')
    cleanDescription = parts[0].trim()
    posterUrl = parts[1].trim() // Получаем чистый URL картинки-заставки
  }

  // КЕЙС 1: Если ссылка ведет на видеофайл
  if (isVideoLink) {
    return (
      <InlineVideoPlayer 
        url={href} 
        linkText={linkText} 
        description={cleanDescription}
        poster={posterUrl} // Передаем постер в плеер
      />
    )
  }

  // КЕЙС 3: Обычная стандартная ссылка на статью или внешний ресурс
  if (!href || (!isAudioLink && !isVideoLink))
    return (
      <a href={href} title={title} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )

  // КЕЙС 2: Аудиоподкаст
  const trackId = href
  const trackTitle = title || (typeof children === 'string' ? children : 'Аудио-версия статьи')
  const trackData = { id: trackId, url: href, title: trackTitle }

  const isInQueue = queue.some((t) => t.id === trackId)
  const activeTrack = currentTrack || (queue.length > 0 ? queue[0] : null)
  const isCurrentActiveTrack = activeTrack?.id === trackId
  const isThisTrackPlaying = isCurrentActiveTrack && isPlaying

  return (
    <div className='article-podcast-inline-wrapper' style={{ fontWeight: 500, fontSize: 'small', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h2>{`🎙️ ${trackData.title}`}</h2>
      
      <div
        className="article-podcast-inline-control"
        style={{
          display: 'inline-flex',
          width: 'fit-content',
          alignItems: 'center', gap: '6px', padding: '16px', borderRadius: '32px',
          // backgroundColor: 'rgba(255,142,83,.08)',
          // border: '1px solid rgba(255, 142, 83, 0.15)',
          verticalAlign: 'middle',
        }}>
        <button
          onClick={() => toggleTrack(trackData)}
          className={`podcast-inline-btn-play ${isThisTrackPlaying ? 'active' : ''}`}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: isThisTrackPlaying ? '#FF8E53' : 'transparent', // 'rgba(255, 142, 83, 0.5)',
            color: isThisTrackPlaying ? '#fff' : 'inherit',
            border: isThisTrackPlaying ? '2px solid transparent' : '2px solid #FF8E53',
            padding: '6px 14px',
            borderRadius: '24px', cursor: 'pointer',
            // fontSize: '0.85em',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
          }}
        >
          {isThisTrackPlaying
            ? <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}><span>⏸</span><span>Слушаю сейчас</span></span>
            : <span style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}><span>▶</span><span>Слушать сейчас</span></span>
          }
        </button>

        <button
          onClick={() => {
            switch (isInQueue) {
              case true:
                switch (isThisTrackPlaying) {
                  case true:
                    stopTrack()
                    removeFromQueue(trackId)
                  default:
                    removeFromQueue(trackId)
                    break
                }
                break
              default:
                addToQueue(trackData)
                break
            }
          }}
          className={`podcast-inline-btn-queue ${isInQueue ? 'in-queue' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none',
            color: (isInQueue && !isThisTrackPlaying)
              ? '#FF8E53'
              : (isInQueue && isThisTrackPlaying)
                ? '#39e5ac'
                : 'inherit',
            opacity: isInQueue ? 1 : 0.6,
            padding: '6px 14px', cursor: 'pointer',
            // fontSize: '0.85em',
            fontWeight: 500, transition: 'all 0.2s ease' }}
        >
          {isInQueue
            ? (<span style={{ fontWeight: 'bold', display: 'inline-flex', gap: '8px', alignItems: 'center' }}><span>✓</span><span>В очереди</span></span>)
            : (<span style={{ fontWeight: 'bold', display: 'inline-flex', gap: '8px', alignItems: 'center' }}><span>＋</span><span>В очередь</span></span>)
          }
        </button>
      </div>
    </div>
  )
}

export const SelfLinkRenderer = (props: any) => (
  // eslint-disable-next-line react/jsx-no-target-blank
  <a href={props.href} target="_self" className='truncate'>
    {props.children}
  </a>
)
