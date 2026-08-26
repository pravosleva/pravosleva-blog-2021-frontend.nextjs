// src/components/LiveStatusBadge.tsx
import React, { useMemo } from 'react'
import styles from './LiveStatusBadge.module.scss'
import { useAudioPodcast } from '../../../../store/reactive-engine/audio-podcast/hooks'
import clsx from 'clsx'

export const LiveStatusBadge = () => {
  const { currentTrack, isPlaying, isBuffering, trackErrors } = useAudioPodcast()

  // Вычисляем текущий статус живого стрима
  const status = useMemo<'ok' | 'buffering' | 'error' | 'idle'>(() => {
    if (!currentTrack) return 'idle'
    
    // Если по текущему активному треку радио зафиксирован текстовый лог ошибки
    if (trackErrors[currentTrack.id]) {
      return 'error'
    }
    
    // Если идет процесс ожидания байт из сети
    if (isBuffering) {
      return 'buffering'
    }
    
    // Если поток успешно воспроизводится без сбоев
    if (isPlaying) {
      return 'ok'
    }
    
    return 'idle' // Радио на паузе
  }, [currentTrack, isPlaying, isBuffering, trackErrors])

  if (status === 'idle') return null

  // Динамический текст в зависимости от рантайм-состояния
  const getBadgeText = () => {
    switch (status) {
      case 'buffering': return 'БУФЕРИЗАЦИЯ... ⏳'
      case 'error': return 'ЭФИР СОРВАН ❌'
      default: return 'ПРЯМОЙ ЭФИР'
    }
  }

  return (
    <div 
      className={styles.badgeWrapper}
      style={{
        // Динамическое изменение цвета рамки и фона плашки под статус
        borderColor: status === 'error' ? 'rgba(255, 83, 112, 0.2)' : status === 'buffering' ? 'rgba(255, 203, 107, 0.2)' : 'rgba(0, 255, 204, 0.2)',
        background: status === 'error' ? 'rgba(255, 83, 112, 0.03)' : status === 'buffering' ? 'rgba(255, 203, 107, 0.03)' : 'rgba(0, 255, 204, 0.03)'
      }}
    >
      {/* 🔮 Пульсирующая неоновая точка со снайперским переключением классов */}
      <span 
        className={clsx(styles.statusDot, {
          [styles['statusDot--ok']]: status === 'ok',
          [styles['statusDot--buffering']]: status === 'buffering',
          [styles['statusDot--error']]: status === 'error',
        })} 
      />
      <span 
        className={styles.badgeText}
        style={{
          // Динамический цвет текста
          color: status === 'error' ? '#ff5370' : status === 'buffering' ? '#ffcb6b' : '#00ffcc'
        }}
      >
        {getBadgeText()}
      </span>
    </div>
  )
}
