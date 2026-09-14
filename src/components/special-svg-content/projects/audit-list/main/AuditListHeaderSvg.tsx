// src/components/Svg/AuditListHeaderSvg.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

interface IAuditListHeaderProps {
  message?: string
}

export const AuditListHeaderSvg: React.FC<IAuditListHeaderProps> = ({
  message = 'Автоматизированный инструмент для анализа структуры контента, валидации front-matter метаданных и контроля целостности внутренних связей.'
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
      {/* 🧭 СТАБИЛИЗИРОВАННЫЙ ПЛАНШЕТ АУДИТА */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }} 
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="audit-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.12" />
          </filter>
          
          <style>
            {`
              @keyframes laser-scan {
                0% { y1: 100px; y2: 100px; }
                100% { y1: 240px; y2: 240px; }
              }
              @keyframes blink-light {
                0% { opacity: 0.3; }
                50% { opacity: 1; }
                100% { opacity: 0.3; }
              }
              @keyframes panel-float {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-6px); }
              }
              .laser-line-node {
                animation: laser-scan 2s ease-in-out infinite alternate;
              }
              .status-dot {
                animation: blink-light 1.2s ease-in-out infinite;
              }
              .floating-pad {
                animation: panel-float 3s ease-in-out infinite alternate;
                transform-origin: 400px 180px;
              }
            `}
          </style>
        </defs>

        {/* Задний закругленный бокс-подложка */}
        <rect x="230" y="30" width="340" height="300" rx="28" fill={subColor} filter="url(#audit-shadow)" />

        {/* Анимированный планшет аудитора (Все внутренние элементы жестко зацентрированы) */}
        <g className="floating-pad" filter="url(#audit-shadow)">
          
          {/* Корпус планшета */}
          <rect x="290" y="70" width="220" height="220" rx="20" fill={isDark ? '#2e2e34' : '#ffffff'} stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="2" />
          
          {/* Экранная область аудита */}
          <rect x="315" y="95" width="170" height="150" rx="8" fill={isDark ? '#1a1a1f' : '#f9f9f9'} />

          {/* Строки Чек-листа */}
          <g transform="translate(335, 125)">
            <circle cx="0" cy="0" r="5" fill="#39e5ac" />
            <rect x="14" y="-3" width="90" height="6" rx="3" fill={isDark ? '#333338' : '#e5e5e5'} />
          </g>
          
          <g transform="translate(335, 155)">
            <circle cx="0" cy="0" r="5" fill={primaryColor} className="status-dot" />
            <rect x="14" y="-3" width="110" height="6" rx="3" fill={isDark ? '#333338' : '#e5e5e5'} />
          </g>

          <g transform="translate(335, 185)">
            <circle cx="0" cy="0" r="5" fill={isDark ? '#444' : '#ccc'} />
            <rect x="14" y="-3" width="75" height="6" rx="3" fill={isDark ? '#333338' : '#e5e5e5'} />
          </g>

          <g transform="translate(335, 215)">
            <circle cx="0" cy="0" r="5" fill="#39e5ac" />
            <rect x="14" y="-3" width="100" height="6" rx="3" fill={isDark ? '#333338' : '#e5e5e5'} />
          </g>

          {/* 📡 СВЕТОВОЙ ЛУЧ ЛАЗЕРА (ИСПРАВЛЕНО: Безопасное инлайн-перемещение по осям y1/y2) */}
          <line x1="315" y1="100" x2="485" y2="100" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" className="laser-line-node" />
          <line x1="315" y1="100" x2="485" y2="100" stroke={primaryColor} strokeWidth="8" opacity="0.25" strokeLinecap="round" className="laser-line-node" />

          {/* Физическая кнопка управления на корпусе */}
          <circle cx="400" cy="265" r="10" fill="none" stroke={isDark ? '#444' : '#ccc'} strokeWidth="2" />
          <rect x="396" y="261" width="8" height="8" rx="1.5" fill="none" stroke={isDark ? '#444' : '#ccc'} strokeWidth="1.5" />
          
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem', padding: '0 16px', marginTop: '0.5rem', width: '100%' }}>
        <h1 style={{ margin: 0, fontFamily: 'Montserrat, system-ui, sans-serif', fontWeight: 'bold', fontSize: '1.6rem', lineHeight: 1.3, color: titleColor }}>
          Помощник аудитора
        </h1>
        <p style={{ margin: 0, fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', fontWeight: 500, lineHeight: 1.5, color: textColor }}>
          {message}
        </p>
      </div>
    </div>
  )
}
