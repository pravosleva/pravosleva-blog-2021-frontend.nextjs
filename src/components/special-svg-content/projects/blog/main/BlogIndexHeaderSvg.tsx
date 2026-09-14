// src/components/Svg/BlogIndexHeaderSvg.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

export const BlogIndexHeaderSvg: React.FC = () => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  
  const primaryColor = isDark ? '#FF8E53' : '#0162c8' // Оранжевый или синий неон
  const subColor = isDark ? '#3a3a3a' : '#f0f0f0'
  const textColor = isDark ? '#b0b0b0' : '#4a4a4a'
  const titleColor = isDark ? '#ffffff' : '#111111'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>
      
      <svg viewBox="0 0 800 340" width="100%" height="auto" style={{ display: 'block', margin: '0 auto', overflow: 'visible' }} xmlns="http://w3.org">
        <defs>
          <filter id="blog-base-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          <style>
            {`
              @keyframes station-float {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-6px); }
              }
              @keyframes orbit-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .anim-station { animation: station-float 3s ease-in-out infinite alternate; transform-origin: 400px 160px; }
              .anim-orbit { animation: orbit-spin 20s linear infinite; transform-origin: 400px 160px; }
            `}
          </style>
        </defs>

        {/* Главный фоновый модуль */}
        <rect x="230" y="30" width="340" height="280" rx="28" fill={subColor} filter="url(#blog-base-shadow)" />

        {/* Космические реактивные орбиты сигналов */}
        <g className="anim-orbit">
          <ellipse cx="400" cy="160" rx="130" ry="40" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.25" transform="rotate(-15 400 160)" />
          <ellipse cx="400" cy="160" rx="150" ry="50" fill="none" stroke={primaryColor} strokeWidth="1" strokeDasharray="6 4" opacity="0.15" transform="rotate(20 400 160)" />
          <circle cx="280" cy="125" r="4" fill={primaryColor} />
          <circle cx="530" cy="200" r="5" fill="#39e5ac" />
        </g>

        {/* Монолитная станция кода (Шаттл / Сервер) */}
        <g className="anim-station" filter="url(#blog-base-shadow)">
          {/* База */}
          <rect x="330" y="90" width="140" height="140" rx="20" fill={isDark ? '#2e2e34' : '#ffffff'} stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="2" />
          
          {/* Символы тегов </ > на экране станции */}
          <path d="M 365 145 L 350 160 L 365 175 M 435 145 L 450 160 L 435 175 M 405 140 L 390 180" fill="none" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Диоды рантайма */}
          <circle cx="355" cy="115" r="4" fill="#39e5ac" />
          <circle cx="375" cy="115" r="4" fill={primaryColor} />
          <line x1="395" y1="115" x2="445" y2="115" stroke={isDark ? '#444' : '#eee'} strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>

      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem', padding: '0 16px', marginTop: '1rem', width: '100%' }}>
        <h2 style={{ margin: 0, fontFamily: 'Montserrat, system-ui, sans-serif', fontWeight: 'bold', fontSize: '1.6rem', lineHeight: 1.3, color: titleColor }}>
          IT Блог
        </h2>
        <p style={{ margin: 0, fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', fontWeight: 500, lineHeight: 1.5, color: textColor }}>
          Заметки frontend-разработчика о проектировании реактивных систем, минимизации техдолга и чистой оптимизации Core Web Vitals.
        </p>
      </div>

    </div>
  )
}
