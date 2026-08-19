import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useAudioPodcast } from './hooks'

export const GlobalAudioPlayer = () => {
  const { 
    queue, 
    currentTrack, 
    isPlayerVisible, 
    trackErrors, 
    removeFromQueue, 
    playTrack, 
    markTrackAsBroken, 
    setPlayerVisible 
  } = useAudioPodcast()
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  // Локальный стейт для пагинации плейлиста
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 2

  // Автоматический сброс страницы на 1, если очередь резко уменьшилась
  const totalPages = Math.ceil(queue.length / itemsPerPage)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [queue.length, totalPages, currentPage])

  // Автозапуск при смене трека
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load()
      audioRef.current.play().catch(() => {
        console.log('▶ Воспроизведение ожидает клика пользователя.')
      })
    }
  }, [currentTrack])

  // Пагинация: вырезаем ровно 2 трека для текущей страницы
  const paginatedQueue = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return queue.slice(startIndex, startIndex + itemsPerPage)
  }, [queue, currentPage])

  if (!isPlayerVisible || queue.length === 0) return null

  const activeTrack = currentTrack || queue[0]
  const isCurrentTrackBroken = trackErrors[activeTrack?.id]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#111111',
      color: '#fff',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.7)',
      zIndex: 2000,
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 10px)',
      paddingTop: '10px',
      paddingLeft: '20px',
      paddingRight: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px', // Уменьшили зазоры для компактности
      maxWidth: '600px', // Ограничили ширину на десктопе
      margin: '0 auto', // Центрируем на десктопе
      borderRadius: '16px 16px 0 0', // Красивые скругления сверху
    }}>
      
      {/* ЛИНЕЙКА 1: Информация о треке и кнопка закрытия */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Сейчас играет ({queue.indexOf(activeTrack) + 1} из {queue.length})
            </span>
            {isCurrentTrackBroken && (
              <span style={{ color: '#ff4d4d', fontSize: '0.75em', fontWeight: 500 }}>
                ⚠️ Файл недоступен
              </span>
            )}
          </div>
          <div style={{ 
            fontWeight: 500, 
            fontSize: '0.95em', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            color: '#FF8E53'
          }}>
            {activeTrack?.title}
          </div>
        </div>
        <button 
          onClick={() => setPlayerVisible(false)}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.1em', padding: '4px' }}
        >
          ✕
        </button>
      </div>

      {/* ЛИНЕЙКА 2: Нативный плеер (сделали его уже) */}
      {activeTrack && (
        <audio 
          ref={audioRef} 
          src={activeTrack.url} 
          controls 
          style={{ width: '100%', height: '36px' }} // Фиксированная уменьшенная высота плеера
          onError={() => markTrackAsBroken(activeTrack.id)}
        />
      )}

      {/* ЛИНЕЙКА 3: Очередь с пагинацией по 2 штуки */}
      <div style={{ 
        marginTop: '2px', 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        paddingTop: '6px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.4)' }}>
            Очередь подкастов: <b style={{ color: '#fff' }}>{queue.length}</b>
          </div>
          
          {/* Контроллы пагинации (рендерим только если страниц больше одной) */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', 
                  padding: '2px 8px', borderRadius: '4px', cursor: currentPage === 1 ? 'default' : 'pointer',
                  opacity: currentPage === 1 ? 0.3 : 1, fontSize: '0.8em'
                }}
              >
                ◀
              </button>
              <span style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.5)' }}>
                {currentPage} / {totalPages}
              </span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', 
                  padding: '2px 8px', borderRadius: '4px', cursor: currentPage === totalPages ? 'default' : 'pointer',
                  opacity: currentPage === totalPages ? 0.3 : 1, fontSize: '0.8em'
                }}
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {/* Список 2-х треков */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {paginatedQueue.map((track) => {
            const isPlaying = track.id === activeTrack?.id
            const isBroken = trackErrors[track.id]
            
            return (
              <div 
                key={track.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '4px 8px', 
                  borderRadius: '6px',
                  backgroundColor: isPlaying ? 'rgba(255,142,83,0.08)' : 'rgba(255,255,255,0.01)',
                  border: isPlaying ? '1px solid rgba(255,142,83,0.2)' : '1px solid transparent'
                }}
              >
                <span 
                  onClick={() => !isBroken && playTrack(track)}
                  style={{ 
                    cursor: isBroken ? 'default' : 'pointer', 
                    fontWeight: isPlaying ? 500 : 400,
                    textDecoration: isBroken ? 'line-through' : 'none',
                    color: isBroken ? '#ff4d4d' : (isPlaying ? '#FF8E53' : 'rgba(255,255,255,0.8)'),
                    fontSize: '0.85em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    marginRight: '10px'
                  }}
                >
                  {track.title}
                </span>
                <button 
                  onClick={() => removeFromQueue(track.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'rgba(255,77,77,0.7)', 
                    cursor: 'pointer', 
                    fontSize: '0.8em',
                    padding: '2px 6px'
                  }}
                >
                  Удалить
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
