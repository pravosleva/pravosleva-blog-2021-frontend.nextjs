import React from 'react'
import { useAudioPodcast } from '../../store/reactive-engine/audio-podcast/hooks'

export const GlobalPodcastSidebarButton = () => {
  const { queue, isPlayerVisible, setPlayerVisible } = useAudioPodcast()

  // Если подкастов в очереди нет — ничего не рендерим
  if (queue.length === 0) return null

  return (
    <>
      <button
        onClick={() => setPlayerVisible(!isPlayerVisible)}
        style={{
          position: 'fixed',
          // ВНИМАНИЕ: Отрегулируйте эти координаты под ваш блок шаринга статьи!
          // Например, если кнопки шаринга зафиксированы слева: left: '40px', bottom: '200px'
          // Если справа: right: '40px', bottom: '260px' (чуть выше плеера)
          right: '38px', 
          bottom: '290px', 
          
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: isPlayerVisible ? '#FF8E53' : 'rgba(30, 30, 30, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1.25em',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 1900, // Чуть ниже, чем сам плеер (у плеера 2000)
        }}
        className="global-desktop-podcast-trigger"
        title={isPlayerVisible ? "Скрыть плеер подкастов" : "Открыть плеер подкастов"}
      >
        {isPlayerVisible ? '⬇️' : '📻'}
      </button>

      {/* Инжектим CSS-правило для скрытия на мобильных устройствах */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .global-desktop-podcast-trigger {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
