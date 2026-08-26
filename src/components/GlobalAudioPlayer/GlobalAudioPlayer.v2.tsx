import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useAudioPodcast } from '../../store/reactive-engine/audio-podcast/hooks'

export const GlobalAudioPlayer = () => {
  const { 
    queue, currentTrack, isPlayerVisible, isPlayerMinimized, trackErrors, 
    removeFromQueue,
    // playTrack,
    markTrackAsBroken, setPlayerMinimized,
    saveTrackProgress, getTrackProgress 
  } = useAudioPodcast()
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const [progressPercent, setProgressPercent] = useState<number>(0)
  const lastSavedTimeRef = useRef<number>(0)
  
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 2
  const totalPages = Math.ceil(queue.length / itemsPerPage)

  const activeTrack = currentTrack || queue[0]
  const isCurrentTrackBroken = trackErrors[activeTrack?.id]

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages)
  }, [queue.length, totalPages, currentPage])

  // ИСПРАВЛЕНО: Этот эффект следит ИСКЛЮЧИТЕЛЬНО за физической сменой URL файла.
  // Переключение флага исМинимизед больше никак не может вызвать .load() и прервать звук!
  useEffect(() => {
    if (audioRef.current && activeTrack?.url) {
      audioRef.current.load()
      setProgressPercent(0)
      lastSavedTimeRef.current = 0

      audioRef.current.play().catch(() => {
        console.log('▶ Воспроизведение ожидает клика пользователя.')
      })
    }
  }, [activeTrack?.url]) // Завязываемся СТРОГО на URL файла

  // Восстановление позиции при первой готовности медиа-кадра
  const handleLoadedData = () => {
    if (!audioRef.current || !activeTrack) return
    const savedTime = getTrackProgress(activeTrack.id)
    
    if (savedTime > 0 && savedTime < audioRef.current.duration) {
      audioRef.current.currentTime = savedTime
      lastSavedTimeRef.current = savedTime
      setProgressPercent((savedTime / audioRef.current.duration) * 100)
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current || !activeTrack) return
    const current = audioRef.current.currentTime
    const duration = audioRef.current.duration
    
    if (duration) {
      setProgressPercent((current / duration) * 100)
    }

    if (Math.abs(current - lastSavedTimeRef.current) > 2) {
      saveTrackProgress(activeTrack.id, current)
      lastSavedTimeRef.current = current
    }
  }

  if (!isPlayerVisible || queue.length === 0 || !activeTrack) return null

  const paginatedQueue = queue.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const containerStyle: React.CSSProperties = {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    backgroundColor: '#111111', color: '#fff',
    boxShadow: '0 -10px 30px rgba(0,0,0,0.7)', zIndex: 2000,
    backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)',
    maxWidth: '600px', margin: '0 auto', borderRadius: '16px 16px 0 0',
    transition: 'all 0.2s ease-out',
    overflow: 'hidden',
  }

  return (
    <div style={{ 
      ...containerStyle, 
      paddingBottom: isPlayerMinimized ? '0px' : 'calc(env(safe-area-inset-bottom, 16px) + 10px)',
      paddingTop: '10px',
      paddingLeft: '20px',
      paddingRight: '20px',
      gap: isPlayerMinimized ? '0px' : '8px',
      display: 'flex', 
      flexDirection: 'column' 
    }}>

      {/* ─── ВАРИАНТ 1: МАКСИМАЛЬНО СВЕРНУТЫЙ МИНИ-ПЛЕЕР ─────────────────── */}
      {isPlayerMinimized ? (
        <div style={{ 
          position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 10px)'
        }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ animation: 'spin 4s linear infinite', display: 'inline-block' }}>💿</span>
            <div style={{ fontSize: '0.88em', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'rgba(255,255,255,0.9)' }}>
              {activeTrack.title}
            </div>
          </div>
          
          <button 
            onClick={() => setPlayerMinimized(false)}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.8em', fontWeight: 500 }}
          >
            Развернуть 🔼
          </button>

          <div style={{ position: 'absolute', bottom: 0, left: '-20px', right: '-20px', height: '4px', background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#FF8E53', transition: 'width 0.1s linear' }} />
          </div>
        </div>
      ) : (
        /* ─── ВАРИАНТ 2: ОТОБРАЖЕНИЕ РАЗВЕРНУТОГО ПОЛНОГО ПЛЕЕРА ───────────── */
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                  Сейчас играет ({queue.indexOf(activeTrack) + 1} из {queue.length})
                </span>
                {isCurrentTrackBroken && <span style={{ color: '#ff4d4d', fontSize: '0.75em' }}>⚠️ Файл недоступен</span>}
              </div>
              <div style={{ fontWeight: 500, fontSize: '0.95em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#FF8E53' }}>
                {activeTrack?.title}
              </div>
            </div>
            
            <button 
              onClick={() => setPlayerMinimized(true)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.88em', padding: '4px' }}
            >
              ✕ Свернуть
            </button>
          </div>

          <div style={{ marginTop: '2px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.4)' }}>
                Очередь подкастов: <b style={{ color: '#fff' }}>{queue.length}</b>
              </div>
              
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', opacity: currentPage === 1 ? 0.3 : 1, fontSize: '0.8em' }}>◀</button>
                  <span style={{ fontSize: '0.75em', color: 'rgba(255,255,255,0.5)' }}>{currentPage} / {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '4px', opacity: currentPage === totalPages ? 0.3 : 1, fontSize: '0.8em' }}>▶</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {paginatedQueue.map((track) => {
                const isPlaying = track.id === activeTrack?.id
                const isBroken = trackErrors[track.id]
                
                return (
                  <div key={track.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', borderRadius: '6px', backgroundColor: isPlaying ? 'rgba(255,142,83,0.08)' : 'rgba(255,255,255,0.01)', border: isPlaying ? '1px solid rgba(255,142,83,0.2)' : '1px solid transparent' }}>
                    <span 
                      // onClick={() => !isBroken && playTrack(track)}
                      style={{ cursor: isBroken ? 'default' : 'pointer', fontWeight: isPlaying ? 500 : 400, textDecoration: isBroken ? 'line-through' : 'none', color: isBroken ? '#ff4d4d' : (isPlaying ? '#FF8E53' : 'rgba(255,255,255,0.8)'), fontSize: '0.85em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, marginRight: '10px' }}
                    >
                      {track.title}
                    </span>
                    <button onClick={() => removeFromQueue(track.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,77,77,0.7)', cursor: 'pointer', fontSize: '0.8em', padding: '2px 6px' }}>Удалить</button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* ИСПРАВЛЕНО: Тег audio лежит в корне разметки компонента, ЕДИНЫЙ и неделимый.
          Его пропсы onLoadedData и onTimeUpdate декларативно привязаны к нему и не сбрасываются */}
        <audio 
          ref={audioRef} 
          src={activeTrack.url} 
          controls={!isPlayerMinimized}
          style={{ width: '100%', height: '36px', display: isPlayerMinimized ? 'none' : 'block' }} 
          onLoadedData={handleLoadedData}
          onTimeUpdate={handleTimeUpdate}
          onError={() => markTrackAsBroken(activeTrack.id, 'ERR')}
        />

      <style jsx global>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
