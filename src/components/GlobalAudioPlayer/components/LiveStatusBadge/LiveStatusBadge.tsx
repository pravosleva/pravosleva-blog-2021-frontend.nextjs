// src/components/LiveStatusBadge.tsx
import React, { useMemo } from 'react'
import styles from './LiveStatusBadge.module.scss'
import { useAudioPodcast } from '../../../../store/reactive-engine/audio-podcast/hooks'
import clsx from 'clsx'

export const LiveStatusBadge = () => {
  const { currentTrack, isPlaying, isBuffering, trackErrors, isLive } = useAudioPodcast()

  // Вычисляем текущий статус живого стрима
  const status = useMemo<'ok' | 'buffering' | 'error' | 'idle'>(() => {
    if (!currentTrack || !isLive) return 'idle'
    if (trackErrors[currentTrack.id]) return 'error'
    if (isBuffering) return 'buffering'
    if (isPlaying) return 'ok'
    
    return 'idle' // Радио на паузе
  }, [currentTrack, isPlaying, isBuffering, trackErrors, isLive])

  // if (!isLive) return null

  // Динамический текст в зависимости от рантайм-состояния
  const getBadgeText = () => {
    switch (status) {
      case 'buffering': return 'БУФЕРИЗАЦИЯ...'
      case 'error': return 'ЭФИР СОРВАН'
      case 'idle': return 'ОЖИДАНИЕ ⏸' // Текст для режима паузы радио
      default: return 'ПРЯМОЙ ЭФИР'
    }
  }

  // Вспомогательные инлайн-расцветки для контейнера
  const badgeStyles = {
    error: { border: 'rgba(255, 83, 112, 0.2)', bg: 'rgba(255, 83, 112, 0.03)', text: '#ff5370' },
    buffering: { border: 'rgba(255, 203, 107, 0.2)', bg: 'rgba(255, 203, 107, 0.03)', text: '#ffcb6b' },
    ok: { border: 'rgba(0, 255, 204, 0.2)', bg: 'rgba(0, 255, 204, 0.03)', text: '#00ffcc' },
    idle: { border: 'rgba(112, 122, 138, 0.2)', bg: 'rgba(112, 122, 138, 0.03)', text: '#707a8a' }
  }[status]

  return (
    <div 
      className={styles.badgeWrapper}
      style={{
        borderColor: badgeStyles.border,
        background: badgeStyles.bg
      }}
    >
      {/* 🔮 Пульсирующая неоновая точка со снайперским переключением классов */}
      <span 
        className={clsx(styles.statusDot, {
          [styles['statusDot--ok']]: status === 'ok',
          [styles['statusDot--buffering']]: status === 'buffering',
          [styles['statusDot--error']]: status === 'error',
          [styles['statusDot--idle']]: status === 'idle',
        })} 
      />
      <span className={styles.badgeText} style={{ color: badgeStyles.text }}>
        {getBadgeText()}
      </span>
    </div>
  )
}
