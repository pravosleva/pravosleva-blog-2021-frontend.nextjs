import React, { useEffect, useRef, useState } from 'react'
import { useAudioPodcast } from './hooks'

export const GlobalAudioPlayer = () => {
  const { 
    queue, currentTrack, isPlayerVisible, isPlayerMinimized, trackErrors, isPlaying,
    removeFromQueue, toggleTrack, markTrackAsBroken, setPlayerMinimized, setIsPlaying,
    saveTrackProgress, getTrackProgress, registerAudioElement
  } = useAudioPodcast()
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [progressPercent, setProgressPercent] = useState<number>(0)
  const lastSavedTimeRef = useRef<number>(0)
  
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 2
  const totalPages = Math.ceil(queue.length / itemsPerPage)

  const activeTrack = currentTrack || (queue.length > 0 ? queue[0] : null);
  const isCurrentTrackBroken = activeTrack ? trackErrors[activeTrack.id] : false;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages)
  }, [queue.length, totalPages, currentPage])

  // ИСПРАВЛЕНО: Теперь элемент регистрируется ВСЕГДА, так как тег <audio> больше не размонтируется
  useEffect(() => {
    if (audioRef.current) {
      registerAudioElement(audioRef.current)
    }
    return () => {
      registerAudioElement(null)
    }
  }, [registerAudioElement])

  // Сброс графики прогресс-бара при физической смене подкаста
  useEffect(() => {
    if (activeTrack?.url) {
      setProgressPercent(0)
      lastSavedTimeRef.current = 0
      
      if (audioRef.current) {
        const savedTime = getTrackProgress(activeTrack.id);
        if (savedTime > 0 && audioRef.current.currentTime !== savedTime) {
          audioRef.current.currentTime = savedTime;
        }
      }
    }
  }, [activeTrack?.id])

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

  // ИСПРАВЛЕНО: Если треков нет, мы всё равно рендерим скрытый тег <audio>, чтобы сервис всегда имел к нему доступ!
  const hasTracks = queue.length > 0 && activeTrack;

  return (
    <>
      {/* Нативный тег audio теперь живет в DOM постоянно и скрыт от пользователя */}
      <audio 
        ref={audioRef} 
        controls={false}
        style={{ display: 'none' }} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate} 
        onError={() => activeTrack && markTrackAsBroken(activeTrack.id)}
      />

      {/* ИСПРАВЛЕНО: Визуальную шторку плеера рендерим строго по условию видимости */}
      {isPlayerVisible && hasTracks && (
        <div className={`blog-audio-player-container ${isPlayerMinimized ? 'is-minimized' : ''}`} style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2000,
          backdropFilter: 'blur(8px)', maxWidth: '600px', margin: '0 auto', borderRadius: '16px 16px 0 0',
          transition: 'all 0.2s ease-out', overflow: 'hidden', paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px',
          display: 'flex', flexDirection: 'column',
          paddingBottom: isPlayerMinimized ? '0px' : 'calc(env(safe-area-inset-bottom, 16px) + 10px)',
          gap: isPlayerMinimized ? '0px' : '8px',
        }}>
          {isPlayerMinimized ? (
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 10px)' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="rotating-disk" style={{ display: 'inline-block' }}>💿</span>
                <div className="player-main-title" style={{ fontSize: '0.88em', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeTrack.title}
                </div>
              </div>
              <button onClick={() => setPlayerMinimized(false)} className="player-btn-action">Развернуть 🔼</button>
              <div className="player-progress-track" style={{ position: 'absolute', bottom: 0, left: '-20px', right: '-20px', height: '4px' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: '#FF8E53', transition: 'width 0.1s linear' }} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="player-meta-info" style={{ fontSize: '0.75em', textTransform: 'uppercase' }}>Сейчас играет ({queue.indexOf(activeTrack) + 1} из {queue.length})</span>
                    {isCurrentTrackBroken && <span style={{ color: '#ff4d4d', fontSize: '0.75em' }}>⚠️ Файл недоступен</span>}
                  </div>
                  <div className="player-active-title" style={{ fontWeight: 500, fontSize: '0.95em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeTrack.title}</div>
                </div>
                <button onClick={() => setPlayerMinimized(true)} className="player-btn-minimize">✕ Свернуть</button>
              </div>

              <div className="player-queue-section" style={{ marginTop: '2px', paddingTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div className="player-meta-info" style={{ fontSize: '0.75em' }}>Очередь подкастов: <b className="player-queue-count">{queue.length}</b></div>
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="player-pagination-btn">◀</button>
                      <span className="player-meta-info" style={{ fontSize: '0.75em' }}>{currentPage} / {totalPages}</span>
                      <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="player-pagination-btn">▶</button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {queue.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((track) => {
                    const isTrackActiveInPlayer = activeTrack?.id === track.id
                    const isTrackPlayingNow = isTrackActiveInPlayer && isPlaying
                    const isBroken = trackErrors[track.id]
                    
                    return (
                      <div key={track.id} className={`player-queue-item ${isTrackActiveInPlayer ? 'active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', borderRadius: '6px' }}>
                        <span 
                          onClick={() => !isBroken && toggleTrack(track)} 
                          className={`player-track-link ${isBroken ? 'broken' : ''} ${isTrackActiveInPlayer ? 'playing' : ''}`}
                          style={{ cursor: isBroken ? 'default' : 'pointer', fontSize: '0.85em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, marginRight: '10px' }}
                        >
                          {isTrackPlayingNow ? '⏸ ' : (isTrackActiveInPlayer ? '▶ ' : '')}
                          {track.title}
                        </span>
                        <button onClick={() => removeFromQueue(track.id)} className="player-btn-delete">Удалить</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
