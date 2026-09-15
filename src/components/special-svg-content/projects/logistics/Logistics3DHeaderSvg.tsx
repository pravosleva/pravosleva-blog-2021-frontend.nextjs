// src/components/Svg/Logistics3DHeaderSvg.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

interface ILogistics3DHeaderProps {
  message?: string
}

export const Logistics3DHeaderSvg: React.FC<ILogistics3DHeaderProps> = ({
  message = 'Интеллектуальный инструмент для трехмерного моделирования размещения грузов в кузове, минимизации пустот (CLS) и автоматического расчета оптимальных логистических издержек.'
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  
  const primaryColor = isDark ? '#FF8E53' : '#0162c8' // Оранжевый или синий неон
  const subColor = isDark ? '#3a3a3a' : '#f0f0f0'
  const textColor = isDark ? '#b0b0b0' : '#4a4a4a'
  const titleColor = isDark ? '#ffffff' : '#111111'

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%',
        maxWidth: '550px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      {/* 🚚 ЦИФРОВАЯ СТАНЦИЯ 3D ЛОГИСТИКИ */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }} 
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="logistics-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.12" />
          </filter>
          
          <style>
            {`
              @keyframes laser-grid {
                0% { stroke-dashoffset: 40; }
                100% { stroke-dashoffset: 0; }
              }
              @keyframes block-glow {
                0% { fill-opacity: 0.1; stroke-opacity: 0.4; }
                50% { fill-opacity: 0.25; stroke-opacity: 1; }
                100% { fill-opacity: 0.1; stroke-opacity: 0.4; }
              }
              .laser-grid-line {
                stroke-dasharray: 4, 4;
                animation: laser-grid 2s linear infinite;
              }
              .packing-block {
                animation: block-glow 2.5s ease-in-out infinite alternate;
              }
            `}
          </style>
        </defs>

        {/* Задний закругленный бокс-подложка */}
        <rect x="230" y="30" width="340" height="300" rx="28" fill={subColor} filter="url(#logistics-shadow)" />

        {/* 🚛 ИЗОМЕТРИЧЕСКИЙ КОНТУР КУЗОВА ФУРЫ (Жесткие статичные координаты) */}
        <g transform="translate(290, 80)" filter="url(#logistics-shadow)">
          
          {/* Задняя глухая стенка контейнера */}
          <path d="M 40 40 L 180 0 L 180 100 L 40 140 Z" fill={isDark ? '#232328' : '#e8e5e5'} stroke={isDark ? '#444' : '#ccc'} strokeWidth="1.5" />
          
          {/* Направляющие сетки 3D-пространства (Пол кузова) */}
          <path d="M 40 140 L 180 100 L 220 130 L 80 170 Z" fill={isDark ? '#1a1a1f' : '#f5f5f5'} stroke={isDark ? '#333' : '#dcdcdc'} strokeWidth="1" />
          
          {/* Внешний прозрачный каркас фуры */}
          <path d="M 0 60 L 40 40 L 180 0 L 220 15 L 220 130 L 80 170 L 0 110 Z" fill="none" stroke={isDark ? '#555' : '#bbb'} strokeWidth="2" strokeLinejoin="round" />
          
          {/* ========================================================================= */}
          {/* 📦 ТРЕХМЕРНЫЕ БЛОКИ ГРУЗА (ОПТИМАЛЬНАЯ УКЛАДКА) */}
          {/* ========================================================================= */}
          
          {/* Блок 1: Базовый (Уложен в угол) */}
          <g fill={primaryColor} stroke={primaryColor} strokeWidth="1.5" className="packing-block">
            {/* Передняя грань */}
            <path d="M 60 115 L 100 105 L 100 135 L 60 145 Z" />
            {/* Верхняя грань */}
            <path d="M 60 115 L 100 105 L 130 115 L 90 125 Z" fill-opacity="0.5" />
            {/* Боковая грань */}
            <path d="M 100 105 L 130 115 L 130 145 L 100 135 Z" fill-opacity="0.3" />
          </g>

          {/* Блок 2: Алгоритм рассчитывает укладку сверху (Мерцает зеленым неоном успеха) */}
          <g fill="#39e5ac" stroke="#39e5ac" strokeWidth="1.5" className="packing-block" style={{ animationDelay: '1.2s' }}>
            {/* Передняя грань */}
            <path d="M 90 85 L 130 75 L 130 105 L 90 115 Z" />
            {/* Верхняя грань */}
            <path d="M 90 85 L 130 75 L 160 85 L 120 95 Z" fill-opacity="0.5" />
            {/* Боковая грань */}
            <path d="M 130 75 L 160 85 L 160 115 L 130 105 Z" fill-opacity="0.3" />
          </g>

          {/* ========================================================================= */}
          {/* 📡 СЕТКА ЛАЗЕРНОГО СКАНИРОВАНИЯ И РАСЧЕТА СТОИМОСТИ */}
          {/* ========================================================================= */}
          <path d="M 20 50 L 160 10 L 200 40 L 60 80 Z" fill="none" stroke={primaryColor} strokeWidth="1.5" className="laser-grid-line" opacity="0.6" />
          
          {/* Фронтальная линия инспекции */}
          <line x1="0" y1="85" x2="80" y2="145" stroke={primaryColor} strokeWidth="2" strokeDasharray="4 2" className="laser-grid-line" />

          {/* Маленький индикатор стоимости / калькулятор в углу кузова */}
          <g transform="translate(160, 130)">
            <rect x="0" y="0" width="50" height="22" rx="4" fill={isDark ? '#222' : '#fff'} stroke={primaryColor} strokeWidth="1" />
            <text x="25" y="15" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="10" fill={primaryColor}>
              $ COMP
            </text>
          </g>

        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem', padding: '0 16px', marginTop: '0.5rem', width: '100%' }}>
        <h1 style={{ margin: 0, fontFamily: 'Montserrat, system-ui, sans-serif', fontWeight: 'bold', fontSize: '1.6rem', lineHeight: 1.3, color: titleColor }}>
          3D Укладка и Логистика
        </h1>
        <p style={{ margin: 0, fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', fontWeight: 500, lineHeight: 1.5, color: textColor }}>
          {message}
        </p>
      </div>
    </div>
  )
}
