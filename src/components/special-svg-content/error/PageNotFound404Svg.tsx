// src/components/Svg/PageNotFound404Svg.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

interface IPageNotFound404Props {
  message?: string
}

export const PageNotFound404Svg: React.FC<IPageNotFound404Props> = ({ 
  message = 'Запрашиваемый URL-адрес не существует, перенесен или удален.' 
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  const primaryColor = isDark ? '#FF8E53' : '#0162c8'
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
      {/* ГЕОМЕТРИЧЕСКИЙ ВЕКТОР 404 */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto' }}
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="svg-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          <style>
            {`
              @keyframes pulse-radar {
                0% { r: 15px; opacity: 0.8; }
                100% { r: 45px; opacity: 0; }
              }
              @keyframes float-item {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-10px); }
              }
              .radar-circle { animation: pulse-radar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
              .floating-loop { animation: float-item 2s ease-in-out infinite alternate; }
            `}
          </style>
        </defs>

        <circle cx="400" cy="180" r="30" fill="none" stroke={primaryColor} strokeWidth="2" opacity="0.3" />
        <circle cx="400" cy="180" r="70" fill="none" stroke={primaryColor} strokeWidth="2" opacity="0.2" />
        <circle cx="400" cy="180" r="120" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.1" />
        <circle cx="400" cy="180" className="radar-circle" fill="none" stroke={primaryColor} strokeWidth="3" />

        <g className="floating-loop" filter="url(#svg-shadow)">
          <text x="260" y="235" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="130" fill={subColor}>4</text>
          <circle cx="400" cy="190" r="55" fill={subColor} stroke={primaryColor} strokeWidth="14" />
          <circle cx="400" cy="190" r="40" fill={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} />
          <text x="470" y="235" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="130" fill={subColor}>4</text>
          <rect x="435" y="225" width="16" height="50" rx="8" transform="rotate(-45 435 225)" fill={primaryColor} />
        </g>
      </svg>

      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.45rem',
          padding: '0 16px',
          marginTop: '1rem'
        }}
      >
        <h2 
          style={{ 
            margin: 0,
            fontFamily: 'Montserrat, system-ui, sans-serif', 
            fontWeight: 'bold', 
            fontSize: '1.5rem', 
            lineHeight: 1.3,
            color: titleColor
          }}
        >
          Страница не найдена
        </h2>
        
        <p 
          style={{ 
            margin: 0,
            fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', 
            fontWeight: 500, 
            lineHeight: 1.5,
            color: textColor
          }}
        >
          {message}
        </p>

        <p 
          style={{ 
            margin: 0,
            fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif',  
            fontWeight: 500, 
            lineHeight: 1.5,
            color: textColor
          }}
        >
          Проверьте правильность пути или вернитесь на главную.
        </p>
      </div>
    </div>
  )
}
