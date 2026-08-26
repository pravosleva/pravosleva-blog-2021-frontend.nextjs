import React, { useEffect, useRef } from 'react'
import { useAudioPodcast } from '../../../store/reactive-engine/audio-podcast/hooks/useAudioPodcast'

export const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const { getAnalyser, isPlaying } = useAudioPodcast()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Функция изменения размера холста под размеры flex-контейнера
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      const analyser = getAnalyser()
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      // Чистим холст перед каждым кадром
      ctx.clearRect(0, 0, width, height)

      if (!analyser || !isPlaying) {
        // Если плеер на паузе, рисуем красивую ровную линию покоя в центре или внизу
        ctx.beginPath()
        ctx.moveTo(0, height - 2)
        ctx.lineTo(width, height - 2)
        ctx.strokeStyle = 'rgba(255, 142, 83, 0.15)'
        ctx.lineWidth = 2
        ctx.stroke()
        return
      }

      // Получаем данные частот
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      // Настройки отрисовки баров
      const barWidth = (width / bufferLength) * 1.4
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        // Нормализуем высоту бара под высоту canvas
        barHeight = (dataArray[i] / 255) * height

        // Делаем красивый градиент для каждого столбика
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight)
        gradient.addColorStop(0, 'rgba(255, 142, 83, 0.1)')  // Полупрозрачный оранжевый снизу
        gradient.addColorStop(1, 'rgba(255, 142, 83, 0.8)')  // Плотный оранжевый сверху

        ctx.fillStyle = gradient

        // Рисуем скругленный прямоугольник (или обычный для производительности)
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight)

        x += barWidth
      }
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [getAnalyser, isPlaying])

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: '100%', 
        height: '16px', // Компактная высота, чтобы вписаться во Flex-стек
        display: 'block',
        // marginTop: '4px',
        // marginBottom: '4px',
        // borderRadius: '8px',
        // background: 'rgba(0, 0, 0, 0.03)' // Легкая подложка для глубины
      }} 
    />
  )
}
