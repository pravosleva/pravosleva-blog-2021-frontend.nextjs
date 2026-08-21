import React, { useEffect, useRef, useState } from 'react'
import { useAudioPodcast } from './hooks'
import clsx from 'clsx'
import { AudioVisualizer } from './components/AudioVisualizer'
import { getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'

const formatAudioTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === Infinity) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const GlobalAudioPlayer = () => {
  const { 
    queue, currentTrack, isPlayerVisible, isPlayerMinimized, trackErrors, isPlaying,
    duration: __duration, currentTime,
    removeFromQueue, toggleTrack, markTrackAsBroken, setPlayerMinimized, setIsPlaying,
    saveTrackProgress, getTrackProgress, registerAudioElement, setDurationValue, stopTrack,
    playNextTrack, seekBackward, seekForward,
    playbackRate, setPlaybackRate,
  } = useAudioPodcast()
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [progressPercent, setProgressPercent] = useState<number>(0)
  const lastSavedTimeRef = useRef<number>(0)
  
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 3
  const totalPages = Math.ceil(queue.length / itemsPerPage)

  const activeTrack = currentTrack || (queue.length > 0 ? queue[0] : null);
  const isCurrentTrackBroken = activeTrack ? trackErrors[activeTrack.id] : false;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages)
  }, [queue.length, totalPages, currentPage])
  // ИСПРАВЛЕНО: Автоматически переводим пагинацию на ту страницу, где находится активный трек
  useEffect(() => {
    if (!activeTrack || queue.length === 0) return

    // 1. Находим физический индекс активного трека в общем массиве очереди
    const trackIndex = queue.findIndex(t => t.id === activeTrack.id)
    if (trackIndex === -1) return

    // 2. Вычисляем, на какой странице пагинации находится этот индекс
    // Математика: индекс 0,1,2 -> страница 1 | индекс 3,4,5 -> страница 2 (при itemsPerPage = 3)
    const targetPage = Math.floor(trackIndex / itemsPerPage) + 1

    // 3. Если мы сейчас не на той странице, мягко переключаем интерфейс
    if (currentPage !== targetPage) {
      setCurrentPage(targetPage)
    }
  }, [activeTrack?.id, queue.length]) // Срабатывает при физической смене трека или обновлении состава очереди


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
      
      // ИСПРАВЛЕНО: Синхронизируем общую длительность трека с реактивным сервисом
      if (__duration !== duration) {
        // audioPodcastService.duration.value = duration
        setDurationValue(duration)
      }
    }

    if (Math.abs(current - lastSavedTimeRef.current) > 2) {
      saveTrackProgress(activeTrack.id, current)
      lastSavedTimeRef.current = current
    }
  }

  // ИСПРАВЛЕНО: Если треков нет, мы всё равно рендерим скрытый тег <audio>, чтобы сервис всегда имел к нему доступ!
  const hasTracks = queue.length > 0 && activeTrack;

  // const [cacheSizeText, setCacheSizeText] = useState<string>('0 Байт')
  // useEffect(() => {
  //   const calculatePodcastCacheSize = async () => {
  //     if (typeof window === 'undefined' || !('caches' in window)) return
  //     try {
  //       // Открываем именно то хранилище, которое мы указали в next.config.js
  //       const cache = await caches.open('podcast-audio-cache')
  //       const keys = await cache.keys()
  //       let totalBytes = 0

  //       for (const request of keys) {
  //         const response = await cache.match(request)
  //         if (response) {
  //           // Читаем заголовок content-length, возвращаемый сервером/CDN
  //           const contentLength = response.headers.get('content-length')
  //           if (contentLength) {
  //             totalBytes += parseInt(contentLength, 10)
  //           }
  //         }
  //       }

  //       // Форматируем байты в понятный человеку вид (Кб / Мб)
  //       if (totalBytes === 0) {
  //         setCacheSizeText('0 Мб')
  //       } else if (totalBytes < 1024 * 1024) {
  //         setCacheSizeText(`${(totalBytes / 1024).toFixed(1)} Кб`)
  //       } else {
  //         setCacheSizeText(`${(totalBytes / (1024 * 1024)).toFixed(1)} Мб`)
  //       }
  //     } catch (e) {
  //       console.error('Ошибка подсчета кэша PWA:', e)
  //       setCacheSizeText('неизвестно')
  //     }
  //   }

  //   calculatePodcastCacheSize()
  // }, [queue.length]) // Пересчитываем размер каждый раз, когда меняется состав очереди треков

  // ДИНАМИЧЕСКИЕ КЛАССЫ АНИМАЦИИ: 
  // Определяем, в каком состоянии сейчас должен находиться контейнер
  let playerStateClass = 'is-hidden' // По умолчанию плеер спрятан под экраном
  
  if (isPlayerVisible && hasTracks) {
    playerStateClass = isPlayerMinimized ? 'is-minimized' : 'is-expanded'
  }

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
        // Привязываем триггер окончания трека к автопереходу сервиса
        onEnded={() => playNextTrack()}

        crossOrigin="anonymous"
      />

      {/* ИСПРАВЛЕНО: Визуальную шторку плеера рендерим строго по условию видимости */}
      {/* {isPlayerVisible && hasTracks && ( */}
        <div className={clsx('blog-audio-player-container', playerStateClass)} style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2000,
          maxWidth: '600px', margin: '0 auto', borderRadius: '20px 20px 0 0',
          transition: 'all 0.2s ease-out', overflow: 'hidden', paddingLeft: '20px', paddingRight: '20px',
          paddingTop: '10px',
          display: 'flex', flexDirection: 'column',
          // paddingBottom: isPlayerMinimized ? '0px' : 'calc(env(safe-area-inset-bottom, 16px) + 10px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 10px)',
          gap: isPlayerMinimized ? '0px' : '8px',
        }}>
          {
            hasTracks && (
              <>
                {isPlayerMinimized ? (
                  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 10px)' }}>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="rotating-disk" style={{ display: 'inline-block' }}>💿</span>
                      <div className="player-main-title" style={{ fontSize: '0.88em', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {activeTrack.title}
                      </div>
                    </div>
                    <button
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      onClick={() => setPlayerMinimized(false)} className="player-btn-action">
                      <span>Развернуть</span><span>🔼</span></button>
                    <div className="player-progress-track" style={{ position: 'absolute', bottom: 0, left: '-20px', right: '-20px', height: '4px' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: '#FF8E53', transition: 'width 0.1s linear' }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        flex: 1, minWidth: 0,
                        // marginRight: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                          <span
                            className="player-meta-info"
                            style={{ fontSize: '0.75em', textTransform: 'uppercase', display: 'inline-flex', gap: '8px', alignItems: 'center' }}
                          >
                            <span>Сейчас играет</span><span>{queue.indexOf(activeTrack) + 1} / {queue.length}</span>
                          </span>
                          
                          {/* ИСПРАВЛЕНО: Добавлен текущий тайминг и общая длительность трека в заголовок шторки */}
                          <span style={{ fontSize: '0.8em', fontWeight: 'bold', color: '#FF8E53', fontFamily: 'monospace' }}>
                            [ {formatAudioTime(currentTime)} / {formatAudioTime(__duration)} ]
                          </span>

                          {isCurrentTrackBroken && <span style={{ color: '#ff4d4d', fontSize: '0.75em' }}>⚠️ Файл недоступен</span>}
                        </div>
                        <div className="player-active-title" style={{ fontWeight: 'bold', fontSize: 'small', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {activeTrack.title}
                        </div>
                      </div>
                      
                      <button
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => setPlayerMinimized(true)} className="player-btn-action">
                          <span>Свернуть</span><span>🔽</span>
                      </button>
                    </div>

                    <AudioVisualizer />

                    <div className="player-queue-section">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'small' }}>
                        {queue.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((track) => {
                          const isTrackActiveInPlayer = activeTrack?.id === track.id
                          const isTrackPlayingNow = isTrackActiveInPlayer && isPlaying
                          const isBroken = trackErrors[track.id]
                          
                          return (
                            <div
                              key={track.id}
                              className={clsx(
                                'player-queue-item',
                                {
                                  ['active']: isTrackActiveInPlayer && !isTrackPlayingNow,
                                  ['active-and-playing']: isTrackActiveInPlayer && isTrackPlayingNow,
                                })
                              }
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px' }}
                            >
                              <span 
                                onClick={() => !isBroken && toggleTrack(track)} 
                                className={`player-track-link ${isBroken ? 'broken' : ''} ${isTrackActiveInPlayer ? 'selected' : ''}`}
                                style={{
                                  cursor: isBroken ? 'default' : 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
                                  // marginRight: '10px',
                                  display: 'inline-flex',
                                  flexDirection: 'row',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ fontFamily: 'monospace, system-ui, Courier' }}>{isTrackPlayingNow ? '⏸' : (isTrackActiveInPlayer ? '▶' : '💤')}</span>
                                <span style={{ fontFamily: 'monospace, system-ui, Courier' }}>{track.title}</span>
                              </span>
                              <button onClick={() => removeFromQueue(track.id)} className="player-btn-delete">Удалить</button>
                            </div>
                          )
                        })}
                      </div>
                      
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                        <div className="player-meta-info" style={{ fontSize: '0.75em', display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          <span>Подкастов в очереди — </span><b className="player-queue-count">{queue.length}</b>
                        </div>

                        {
                          isPlaying && !isCurrentTrackBroken && (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '16px',
                              // padding: '2px',
                              gap: '8px'
                            }}>
                              {[1.0, 1.25, 1.5, 2.0].map((rate) => {
                                const isSelected = playbackRate === rate; // Проверяем, выбрана ли эта скорость сейчас [2]
                                
                                return (
                                  <button
                                    key={rate}
                                    disabled={isSelected} // Текущая скорость становится неактивной для кликов [2]
                                    onClick={() => setPlaybackRate(rate)}
                                    className={`player-rate-btn ${isSelected ? 'is-selected' : ''}`}
                                    style={{
                                      background: isSelected ? '#FF8E53' : 'transparent', // Выделяем активную [2]
                                      // color: isSelected ? '#FFFFFF' : 'inherit',
                                      border: 'none',
                                      // padding: '4px 8px',
                                      borderRadius: '10px',
                                      fontSize: '0.75em',
                                      fontWeight: 600,
                                      cursor: isSelected ? 'default' : 'pointer', // Меняем курсор для заблокированной [2]
                                      opacity: isSelected ? 1 : 0.7,
                                      transition: 'all 0.15s ease',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                    title={isSelected ? `Сейчас установлена скорость x${rate}` : `Переключить скорость на x${rate}`}
                                  >
                                    {rate === 1.0 ? 'x1' : `x${rate}`}
                                  </button>
                                );
                              })}
                            </div>
                          )
                        }
                        
                        {/* ИСПРАВЛЕНО: Добавлен размер занимаемого кэша PWA */}
                        {/* <span style={{ fontSize: '0.7em', padding: '2px 6px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', opacity: 0.8 }} title="Объем аудиофайлов, сохраненных в памяти браузера для оффлайн-доступа">
                          📦 В кэше PWA: <b>{cacheSizeText}</b>
                        </span> */}
                      </div>

                      {
                        ((isPlaying && !isCurrentTrackBroken) || (totalPages > 1)) && (
                          <div
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                            }}>
                            {
                              isPlaying && !isCurrentTrackBroken && (
                                <div style={{ display: 'flex', gap: '8px', flexDirection: 'row' }}>
                                  <button 
                                    onClick={() => stopTrack()} 
                                    className="player-btn-stop"
                                    style={{
                                      background: 'rgba(255, 77, 77, 0.1)',
                                      border: '2px solid rgba(255, 77, 77, 0.2)',
                                      color: '#ff4d4d',
                                      // padding: '6px 12px',
                                      // borderRadius: '12px',
                                      cursor: 'pointer',
                                      fontWeight: 500,
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      // padding: '10px 16px',
                                      // padding: '4px 16px',
                                      fontSize: '1.0rem',
                                      // borderRadius: '8px',
                                    }}
                                    title="Полностью остановить и закрыть плеер"
                                  >
                                    <span>⏏️</span>
                                    {/* <span style={{ fontSize: '0.6rem' }}>Остановить и закрыть</span> */}
                                  </button>
                                  <button 
                                    onClick={() => seekBackward()} 
                                    className="player-btn-seek"
                                    style={{
                                      background: 'rgba(255, 255, 255, 0.08)',
                                      border: '1px solid rgba(255, 255, 255, 0.12)',
                                      // color: 'inherit',
                                      cursor: 'pointer',
                                      fontWeight: 500,
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      // padding: '4px 16px',
                                      fontSize: '1.0rem',
                                      // borderRadius: '8px',
                                    }}
                                    title="Назад на 20 секунд"
                                  >
                                    <span>⏪</span>
                                    {/* <span style={{ fontSize: '0.6rem' }}>-20с</span> */}
                                  </button>
                                </div>
                              )
                            }
                             
                            {totalPages > 1 && (
                              <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="player-pagination-btn">◀</button>
                                <span className="player-meta-info" style={{ fontSize: 'small' }}>{currentPage} / {totalPages}</span>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="player-pagination-btn">▶</button>
                              </div>
                            )}

                            {
                              isPlaying && !isCurrentTrackBroken && (
                                <div style={{ display: 'flex', gap: '8px', flexDirection: 'row' }}>
                                  <button 
                                    onClick={() => seekForward()} 
                                    className="player-btn-seek"
                                    style={{
                                      background: 'rgba(255, 255, 255, 0.08)',
                                      border: '1px solid rgba(255, 255, 255, 0.12)',
                                      // color: 'inherit',
                                      cursor: 'pointer',
                                      fontWeight: 500,
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      // padding: '4px 16px',
                                      fontSize: '1.0rem',
                                      // borderRadius: '8px',
                                    }}
                                    title="Вперед на 20 секунд"
                                  >
                                    {/* <span style={{ fontSize: '0.6rem' }}>+20с</span> */}
                                    <span>⏩</span>
                                  </button>
                                  <button 
                                    onClick={!!activeTrack ? () => toggleTrack(activeTrack) : undefined} 
                                    className="player-btn-pause"
                                    style={{
                                      // background: 'rgba(255, 77, 77, 0.1)',
                                      // border: '2px solid rgba(255, 77, 77, 0.2)',
                                      // border: '2px solid rgb(204, 204, 204)',
                                      background: 'rgba(255, 142, 83, 0.1)',
                                      border: '2px solid rgba(255, 77, 77, 0.2)',
                                      // color: '#ff4d4d',
                                      // padding: '6px 12px',
                                      // borderRadius: '12px',
                                      cursor: 'pointer',
                                      fontWeight: 500,
                                      transition: 'all 0.2s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      // padding: '4px 16px',
                                      fontSize: '1.0rem',
                                      // borderRadius: '8px',
                                    }}
                                    title="Поставить текущий трек на паузу"
                                  >
                                    <span>⏸️</span>
                                    {/* <span style={{ fontSize: '0.6rem' }}>Пауза</span> */}
                                  </button>
                                </div>
                              )
                            }
                          </div>
                        )
                      }
                    </div>
                  </>
                )
              }
              </>
            )
          }
        </div>
      {/* )} */}
    </>
  )
}
