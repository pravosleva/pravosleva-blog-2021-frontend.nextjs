import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useAudioPodcast } from '../../store/reactive-engine/audio-podcast/hooks'

export const GlobalAudioPlayer = () => {
  const { 
    queue, currentTrack, isPlayerVisible, isPlayerMinimized, trackErrors,
    // playTrigger,
    removeFromQueue, markTrackAsBroken, setPlayerMinimized,
    saveTrackProgress, getTrackProgress, registerAudioElement, setIsPlaying, toggleTrack,
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

  // ИСПРАВЛЕНО: Эффект теперь слушает playTrigger. Клик на любой трек из статьи
  // мгновенно вызовет .load() и запустит новый поток, останавливая старый вещатель!
  // useEffect(() => {
  //   if (audioRef.current && activeTrack?.url) {
  //     audioRef.current.load()
  //     setProgressPercent(0)
  //     lastSavedTimeRef.current = 0

  //     audioRef.current.play().catch(() => {
  //       console.log('▶ Воспроизведение ожидает клика пользователя.')
  //     })
  //   }
  // }, [activeTrack?.url, playTrigger]) // Добавили playTrigger в зависимости

  // ИСПРАВЛЕНО: Один единственный React-эффект только для привязки DOM-элемента к сервису
  useEffect(() => {
    if (audioRef.current) {
      registerAudioElement(audioRef.current)
    }
    return () => {
      registerAudioElement(null) // Очищаем при размонтировании
    }
  }, [registerAudioElement])

  // Внутри GlobalAudioPlayer.tsx оставляем только это:
  useEffect(() => {
    if (activeTrack?.url) {
      setProgressPercent(0);
      lastSavedTimeRef.current = 0;
    }
  }, [activeTrack?.url]); // Реагирует только на смену трека для сброса графики плеера

  // Восстановление позиции
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

  // Инлайновые стили геометрии и позиционирования (не зависят от темы)
  const containerGeometryStyle: React.CSSProperties = {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    zIndex: 2000,
    backdropFilter: 'blur(8px)', 
    maxWidth: '600px', margin: '0 auto', borderRadius: '16px 16px 0 0',
    transition: 'all 0.2s ease-out',
    overflow: 'hidden',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '10px',
    display: 'flex', 
    flexDirection: 'column',
    paddingBottom: isPlayerMinimized ? '0px' : 'calc(env(safe-area-inset-bottom, 16px) + 10px)',
    gap: isPlayerMinimized ? '0px' : '8px',
  }

  return (
    // Добавили класс blog-audio-player-container для каскада стилей тем
    <div
      // Добавляем класс 'is-minimized', если плеер свернут
      className={`blog-audio-player-container ${isPlayerMinimized ? 'is-minimized' : ''}`} 
      style={containerGeometryStyle}
    >

      {/* ─── ВАРИАНТ 1: СВЕРНУТЫЙ МИНИ-ПЛЕЕР ─────────────────── */}
      {isPlayerMinimized ? (
        <div style={{ 
          position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 10px)'
        }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="rotating-disk" style={{ display: 'inline-block' }}>💿</span>
            <div className="player-main-title" style={{ fontSize: '0.88em', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeTrack.title}
            </div>
          </div>
          
          <button onClick={() => setPlayerMinimized(false)} className="player-btn-action">
            Развернуть 🔼
          </button>

          {/* Шкала прогресса */}
          <div className="player-progress-track" style={{ position: 'absolute', bottom: 0, left: '-20px', right: '-20px', height: '4px' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#FF8E53', transition: 'width 0.1s linear' }} />
          </div>
        </div>
      ) : (
        /* ─── ВАРИАНТ 2: РАЗВЕРНУТЫЙ ПОЛНЫЙ ПЛЕЕР ───────────── */
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="player-meta-info" style={{ fontSize: '0.75em', textTransform: 'uppercase' }}>
                  Сейчас играет ({queue.indexOf(activeTrack) + 1} из {queue.length})
                </span>
                {isCurrentTrackBroken && <span style={{ color: '#ff4d4d', fontSize: '0.75em' }}>⚠️ Файл недоступен</span>}
              </div>
              <div className="player-active-title" style={{ fontWeight: 500, fontSize: '0.95em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeTrack?.title}
              </div>
            </div>
            
            <button onClick={() => setPlayerMinimized(true)} className="player-btn-minimize">
              ✕ Свернуть
            </button>
          </div>

          <div className="player-queue-section" style={{ marginTop: '2px', paddingTop: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div className="player-meta-info" style={{ fontSize: '0.75em' }}>
                Очередь подкастов: <b className="player-queue-count">{queue.length}</b>
              </div>
              
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="player-pagination-btn">◀</button>
                  <span className="player-meta-info" style={{ fontSize: '0.75em' }}>{currentPage} / {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="player-pagination-btn">▶</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {paginatedQueue.map((track) => {
                const isPlaying = track.id === activeTrack?.id
                const isBroken = trackErrors[track.id]
                const isTrackActiveInPlayer = activeTrack?.id === track.id
                const isTrackPlayingNow = isTrackActiveInPlayer && isPlaying

                return (
                  <div 
                    key={track.id} 
                    className={`player-queue-item ${isPlaying ? 'active' : ''}`}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', borderRadius: '6px' }}
                  >
                    <span 
                      // ИСПРАВЛЕНО: Теперь и из очереди клик по активному треку ставит его на паузу / снимает с паузы!
                      onClick={() => !isBroken && toggleTrack(track)} 
                      // onClick={() => !isBroken && playTrack(track)}
                      // className={`player-track-link ${isBroken ? 'broken' : ''} ${isPlaying ? 'playing' : ''}`}
                      // style={{ cursor: isBroken ? 'default' : 'pointer', fontSize: '0.85em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, marginRight: '10px' }}
                      className={`player-track-link ${isBroken ? 'broken' : ''} ${isTrackActiveInPlayer ? 'playing' : ''}`}
                      style={{ cursor: isBroken ? 'default' : 'pointer', fontSize: '0.85em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, marginRight: '10px' }}
                    >
                      {/* Визуальный маркер статуса внутри списка */}
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

      <audio 
        // ref={audioRef} 
        // src={activeTrack.url} 
        // controls={!isPlayerMinimized}
        // style={{ width: '100%', height: '36px', display: isPlayerMinimized ? 'none' : 'block' }} 
        // onLoadedData={handleLoadedData}
        // onTimeUpdate={handleTimeUpdate}
        // onError={() => markTrackAsBroken(activeTrack.id)}

        // onPlay={() => setIsPlaying(true)}
        // onPause={() => setIsPlaying(false)}
        ref={audioRef} 
        src={activeTrack?.url} 
        controls={!isPlayerMinimized}
        style={{ width: '100%', height: '36px', display: isPlayerMinimized ? 'none' : 'block' }} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedData={handleLoadedData} 
        onTimeUpdate={handleTimeUpdate} 
        onError={() => markTrackAsBroken(activeTrack.id, 'ERR')}
      />
    </div>
  )
}
