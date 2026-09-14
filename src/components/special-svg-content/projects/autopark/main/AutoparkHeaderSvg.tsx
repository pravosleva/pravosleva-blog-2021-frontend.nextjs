// src/components/Svg/AutoparkHeaderSvg.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

interface IAutoparkHeaderProps {
  message?: string
}

export const AutoparkHeaderSvg: React.FC<IAutoparkHeaderProps> = ({
  message = 'Цифровая экосистема для вашего гаража. Добавляйте автомобили, фиксируйте сервисные интервалы и контролируйте пробег в реальном времени.'
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
      {/* 🧭 ЦИФРОВАЯ ПАНЕЛЬ АВТОПАРКА */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }} 
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="gauge-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.12" />
          </filter>
          
          <style>
            {`
              @keyframes arrow-rotate {
                0% { transform: rotate(-20deg); }
                100% { transform: rotate(40deg); }
              }
              @keyframes blink-led {
                0% { opacity: 0.4; }
                50% { opacity: 1; }
                100% { opacity: 0.4; }
              }
              @keyframes float-gauge {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-6px); }
              }
              .gauge-arrow {
                animation: arrow-rotate 2.5s ease-in-out infinite alternate;
                transform-origin: 400px 190px;
              }
              .gauge-led {
                animation: blink-led 1s ease-in-out infinite;
              }
              .floating-dashboard {
                animation: float-gauge 3s ease-in-out infinite alternate;
                transform-origin: 400px 180px;
              }
            `}
          </style>
        </defs>

        {/* Задний закругленный бокс-подложка */}
        <rect x="230" y="30" width="340" height="300" rx="28" fill={subColor} filter="url(#gauge-shadow)" />

        {/* Бортовой компьютер (Изолированная GPU-анимация плавания) */}
        <g className="floating-dashboard" filter="url(#gauge-shadow)">
          
          {/* Контур приборной панели */}
          <rect x="280" y="70" width="240" height="220" rx="24" fill={isDark ? '#2e2e34' : '#ffffff'} stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="2" />
          
          {/* Полукруглая шкала спидометра / тахометра */}
          <path d="M 310 190 A 90 90 0 0 1 490 190" fill="none" stroke={isDark ? '#1a1a1f' : '#eaeaea'} strokeWidth="16" strokeLinecap="round" />
          <path d="M 310 190 A 90 90 0 0 1 445 120" fill="none" stroke={primaryColor} strokeWidth="8" strokeLinecap="round" opacity="0.8" />

          {/* Деления шкалы */}
          <line x1="325" y1="190" x2="335" y2="190" stroke={titleColor} strokeWidth="3" />
          <line x1="400" y1="105" x2="400" y2="115" stroke={titleColor} strokeWidth="3" />
          <line x1="475" y1="190" x2="465" y2="190" stroke={titleColor} strokeWidth="3" />

          {/* Одометр (Электронный счетчик пробега) */}
          <rect x="350" y="215" width="100" height="26" rx="6" fill={isDark ? '#1a1a1f' : '#f5f5f5'} stroke={isDark ? '#444' : '#dcdcdc'} strokeWidth="1" />
          <text x="400" y="233" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="14" fill={primaryColor} letterSpacing="2">
            074820
          </text>
          
          {/* Светодиод активного эко-режима (Связь с ботом) */}
          <circle cx="400" cy="145" r="4" fill="#39e5ac" className="gauge-led" />
          <circle cx="400" cy="145" r="8" fill="none" stroke="#39e5ac" strokeWidth="1" opacity="0.5" className="gauge-led" />

          {/* СТРЕЛКА СТОИТ НАМЕРТВО В ЦЕНТРЕ (ИСПРАВЛЕНО: Безопасное вращение вокруг оси 400, 190) */}
          <g className="gauge-arrow">
            <line x1="400" y1="190" x2="330" y2="140" stroke="#ff4d4d" strokeWidth="4" strokeLinecap="round" />
            <line x1="400" y1="190" x2="330" y2="140" stroke="#ff4d4d" strokeWidth="8" opacity="0.3" strokeLinecap="round" />
          </g>
          
          {/* Центральная заглушка стрелки */}
          <circle cx="400" cy="190" r="10" fill={isDark ? '#111' : '#333'} />
          <circle cx="400" cy="190" r="4" fill="#fff" />
          
        </g>
      </svg>

      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem', padding: '0 16px', marginTop: '0.5rem', width: '100%' }}>
        <h1 style={{ margin: 0, fontFamily: 'Montserrat, system-ui, sans-serif', fontWeight: 'bold', fontSize: '1.6rem', lineHeight: 1.3, color: titleColor }}>
          Гараж (Autopark-2022)
        </h1>
        <p style={{ margin: 0, fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', fontWeight: 500, lineHeight: 1.5, color: textColor }}>
          {message}
        </p>
      </div>
    </div>
  )
}
