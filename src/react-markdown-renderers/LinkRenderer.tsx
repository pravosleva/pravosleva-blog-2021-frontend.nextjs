// import { Button } from '@mui/material'
// import { useMemo } from 'react'
import { useAudioPodcast } from '~/components/GlobalAudioPlayer/hooks'

// export const LinkRenderer = (props: any) => (
//   // eslint-disable-next-line react/jsx-no-target-blank
//   <a href={props.href} target="_blank">
//     {props.children}
//   </a>
// )

// export const LinkRenderer = (props: any) => {
//   // ИСПРАВЛЕНО: Достаем title (из кавычек) и children (из скобок)
//   const { href, children, title } = props
  
//   const { queue, addToQueue, playTrack } = useAudioPodcast()

//   // ИСПРАВЛЕНО: Корректно отрезаем query-параметры от строки, а не от массива
//   const isAudio = useMemo(() => {
//     if (!href || typeof href !== 'string') return false
//     const cleanHref = href.split('?')[0] // Берём строку до знака '?'
//     return (
//       cleanHref.endsWith('.mp3') || 
//       cleanHref.endsWith('.wav') || 
//       cleanHref.endsWith('.m4a')
//     )
//   }, [href])

//   // ИСПРАВЛЕНО: Безопасное извлечение названия трека и его описания
//   const trackData = useMemo(() => {
//     let mainTitle = 'Аудиоподкаст'
//     if (typeof children === 'string') {
//       mainTitle = children
//     } else if (Array.isArray(children)) {
//       mainTitle = children.find(item => typeof item === 'string') || mainTitle
//     }

//     // Формируем красивую сквозную строчку: "Подкаст 1 (Описание 1)"
//     const fullDisplayTitle = title ? `${mainTitle} — ${title}` : mainTitle

//     return {
//       title: fullDisplayTitle,
//       description: title || ''
//     }
//   }, [children, title])

//   if (!href) return null

//   // ─── СЦЕНАРИЙ 1: ЭТО ПОДКАСТ ────────────────────────────────────────
//   if (isAudio) {
//     const trackId = href
//     const isInQueue = queue.some(t => t.id === trackId)
//     const trackPayload = { id: trackId, url: href, title: trackData.title }

//     return (
//       <div style={{
//         marginBottom: '1.45rem',
//         padding: '16px',
//         background: 'rgba(255, 255, 255, 0.05)',
//         borderRadius: '16px',
//         border: '1px solid rgba(255, 255, 255, 0.1)',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '16px'
//       }}>
//         <div style={{ fontWeight: 500, fontSize: 'small', display: 'flex', flexDirection: 'column', gap: '4px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//             <span>🎙️</span> {trackData.title}
//           </div>
//         </div>
        
//         <audio src={href} controls style={{ width: '100%', height: '36px' }} preload="metadata" />
        
//         <div style={{ display: 'flex', gap: '8px' }}>
//           {/* <button 
//             onClick={() => { addToQueue(trackPayload); playTrack(trackPayload); }}
//             style={{ 
//               padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', 
//               background: '#FF8E53', border: 'none', color: '#fff', fontWeight: 500 
//             }}
//           >
//             ▶ Слушать сейчас
//           </button> */}
//           <Button
//             variant='contained'
//             size='small'
//             color='success'
//             onClick={() => { addToQueue(trackPayload); playTrack(trackPayload); }}
//           >
//             ▶ Слушать сейчас
//           </Button>
//           {/* <button 
//             onClick={() => addToQueue(trackPayload)}
//             disabled={isInQueue}
//             style={{ 
//               padding: '8px 16px', 
//               borderRadius: '8px', 
//               cursor: isInQueue ? 'default' : 'pointer',
//               background: isInQueue ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
//               border: 'none',
//               color: isInQueue ? 'rgba(255,255,255,0.3)' : '#fff'
//             }}
//           >
//             {isInQueue ? '✓ В очереди' : '＋ Добавить в очередь'}
//           </button> */}
//           <Button
//             disabled={isInQueue}
//             variant='outlined'
//             size='small'
//             color='secondary'
//             onClick={() => addToQueue(trackPayload)}
//           >
//             {isInQueue ? '✓ В очереди' : '＋ Добавить в очередь'}
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   // ─── СЦЕНАРИЙ 2: ОБЫЧНАЯ ССЫЛКА ──────────────────────────────────────
//   return (
//     // eslint-disable-next-line react/jsx-no-target-blank
//     <a href={href} target="_blank" title={title}>
//       {children}
//     </a>
//   )
// }

interface LinkRendererProps {
  href?: string
  children: React.ReactNode
  title?: string
}

// export const LinkRenderer: React.FC<LinkRendererProps> = ({ href, children, title }) => {
//   const { playTrack } = useAudioPodcast()

//   // Проверяем, является ли ссылка аудио-файлом подкаста (например, .mp3, .wav, .ogg)
//   const isAudioFile = href?.match(/\.(mp3|wav|ogg|m4a)(\?.*)?$/i)

//   const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     if (isAudioFile && href) {
//       // ИСПРАВЛЕНО: Отменяем переход по ссылке и запуск сторонних плееров
//       e.preventDefault()
      
//       // Формируем чистый объект трека для нашей экосистемы
//       const trackTitle = title || (typeof children === 'string' ? children : 'Подкаст статьи')
      
//       // Вызываем глобальный метод: он автоматически перебьет старый звук,
//       // обновит тайминги и развернет шторку
//       playTrack({
//         id: href, // Используем URL в качестве уникального ID
//         url: href,
//         title: trackTitle,
//       })
//     }
//   }

//   return (
//     <a 
//       href={href} 
//       onClick={handleLinkClick}
//       title={title}
//       // Если это обычная ссылка — она откроется в новой вкладке, если подкаст — отработает наш плеер
//       target={isAudioFile ? undefined : '_blank'} 
//       rel={isAudioFile ? undefined : 'noopener noreferrer'}
//     >
//       {children}
//     </a>
//   )
// }

interface LinkRendererProps {
  href?: string
  children: React.ReactNode
  title?: string
}

// export const LinkRenderer: React.FC<LinkRendererProps> = ({ href, children, title }) => {
//   const { queue, currentTrack, isPlaying, playTrack, addToQueue, removeFromQueue, setIsPlaying } = useAudioPodcast()

//   // Проверяем, является ли ссылка аудиофайлом подкаста
//   const isAudioFile = href?.match(/\.(mp3|wav|ogg|m4a)(\?.*)?$/i)

//   // Если это обычная веб-ссылка, рендерим её как стандартный тег <a>
//   if (!isAudioFile || !href) {
//     return (
//       <a href={href} target="_blank" rel="noopener noreferrer" title={title}>
//         {children}
//       </a>
//     )
//   }

//   // Формируем объект трека. ID делаем на основе URL
//   const trackId = href
//   const trackTitle = title || (typeof children === 'string' ? children : 'Аудио-версия статьи')
//   const trackData = { id: trackId, url: href, title: trackTitle }

//   // Проверяем статусы трека в глобальном реактивном состоянии
//   const isInQueue = queue.some((t) => t.id === trackId)

//   // Проверяем, является ли этот трек активным в плеере
//   const isCurrentActiveTrack = currentTrack?.id === trackId || (!currentTrack && queue[0]?.id === trackId)
  
//   // Вычисляем, играет ли конкретно этот инлайн-трек прямо сейчас
//   const isThisTrackPlaying = isCurrentActiveTrack && isPlaying

//   const isPlayingNow = currentTrack?.id === trackId

//   const handlePlayPauseClick = () => {
//     if (isCurrentActiveTrack) {
//       // Переключаем сигнал в сервисе, GlobalAudioPlayer сам поймает это изменение через useEffect
//       setIsPlaying(!isPlaying)
//     } else {
//       playTrack(trackData)
//     }
//   }

//   return (
//     <div style={{ fontWeight: 500, fontSize: 'small', display: 'flex', flexDirection: 'column', gap: '8px' }}>
//       <h2>{`🎙️ ${trackData.title}`}</h2>
    
//       <div 
//         className="article-podcast-inline-control"
//         style={{
//           display: 'inline-flex',
//           width: 'fit-content',
//           alignItems: 'center',
//           gap: '8px',
//           // marginBottom: '1.45rem',
//           padding: '16px',
//           borderRadius: '32px',
//           backgroundColor: 'rgba(255, 142, 83, 0.05)',
//           border: '1px solid rgba(255, 142, 83, 0.15)',
//           verticalAlign: 'middle',
//         }}
//       >
//         {/* 1. КНОПКА ВОСПРОИЗВЕДЕНИЯ / ИНДИКАЦИИ ТЕКУЩЕГО ТРЕКА */}
//         <button
//           // onClick={() => isPlayingNow ?  : playTrack(trackData)}
//           onClick={handlePlayPauseClick}
//           className={`podcast-inline-btn-play ${isPlayingNow ? 'active' : ''}`}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//             background: isPlayingNow ? '#FF8E53' : 'rgba(255, 142, 83, 0.1)',
//             color: isPlayingNow ? '#fff' : 'inherit',
//             border: 'none',
//             padding: '6px 14px',
//             borderRadius: '16px',
//             cursor: 'pointer',
//             fontSize: '0.85em',
//             fontWeight: 500,
//             transition: 'all 0.2s ease',
//           }}
//         >
//           {isPlayingNow ? '⏸ Слушаю сейчас' : '▶ Слушать сейчас'}
//         </button>

//         {/* 2. КНОПКА УПРАВЛЕНИЯ ОЧЕРЕДЬЮ (✓ В очереди / ＋ Добавить) */}
//         <button
//           // onClick={() => isInQueue ? removeFromQueue(trackId) : addToQueue(trackData)}
//           onClick={() => isInQueue ? removeFromQueue(trackId) : addToQueue(trackData)}
//           className={`podcast-inline-btn-queue ${isInQueue ? 'in-queue' : ''}`}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//             background: 'none',
//             border: 'none',
//             // borderRadius: '16px',
//             color: isInQueue ? '#39e5ac' : 'inherit',
//             opacity: isInQueue ? 1 : 0.6,
//             padding: '6px 8px',
//             cursor: 'pointer',
//             fontSize: '0.85em',
//             fontWeight: 500,
//             transition: 'all 0.2s ease',
//           }}
//           title={isInQueue ? "Удалить из очереди подкастов" : "Добавить в очередь подкастов"}
//         >
//           {isInQueue ? (
//             <>
//               <span style={{ fontWeight: 'bold' }}>✓</span> В очереди
//             </>
//           ) : (
//             <>
//               <span style={{ fontSize: '1.1em' }}>＋</span> В очередь
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   )
// }

interface LinkRendererProps {
  href?: string
  children: React.ReactNode
  title?: string
}

export const LinkRenderer: React.FC<LinkRendererProps> = ({ href, children, title }) => {
  const { queue, currentTrack, isPlaying, toggleTrack, addToQueue, removeFromQueue, stopTrack } = useAudioPodcast()
  const isAudioFile = href?.match(/\.(mp3|wav|ogg|m4a)(\?.*)?$/i)

  if (!isAudioFile || !href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" title={title}>{children}</a>
  }

  const trackId = href
  const trackTitle = title || (typeof children === 'string' ? children : 'Аудио-версия статьи')
  const trackData = { id: trackId, url: href, title: trackTitle }

  const isInQueue = queue.some((t) => t.id === trackId)
  const activeTrack = currentTrack || (queue.length > 0 ? queue[0] : null)
  const isCurrentActiveTrack = activeTrack?.id === trackId
  const isThisTrackPlaying = isCurrentActiveTrack && isPlaying

  return (
    <div style={{ fontWeight: 500, fontSize: 'small', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h2>{`🎙️ ${trackData.title}`}</h2>
      
      <div
        className="article-podcast-inline-control"
        style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: '8px', padding: '16px', borderRadius: '32px', backgroundColor: 'rgba(255,142,83,.08)', border: '1px solid rgba(255, 142, 83, 0.15)', verticalAlign: 'middle' }}>
        <button
          onClick={() => toggleTrack(trackData)}
          className={`podcast-inline-btn-play ${isThisTrackPlaying ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isThisTrackPlaying ? '#FF8E53' : 'rgba(255, 142, 83, 0.1)', color: isThisTrackPlaying ? '#fff' : 'inherit', border: 'none', padding: '6px 14px', borderRadius: '16px', cursor: 'pointer',
            // fontSize: '0.85em',
            fontWeight: 500, transition: 'all 0.2s ease' }}
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
            padding: '6px 8px', cursor: 'pointer',
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
