import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

export const AuthSuccessSvg: React.FC = () => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  const subColor = isDark ? '#3a3a3a' : '#f0f0f0'
  const textColor = isDark ? '#b0b0b0' : '#4a4a4a'
  const titleColor = isDark ? '#ffffff' : '#111111'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '550px', margin: '0 auto', textAlign: 'center' }}>
      <svg viewBox="0 0 800 360" width="100%" height="auto" style={{ display: 'block', margin: '0 auto' }} xmlns="http://w3.org">
        <defs>
          <filter id="success-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          <style>
            {`
              @keyframes draw-check {
                0% { stroke-dashoffset: 100; }
                100% { stroke-dashoffset: 0; }
              }
              .animated-check {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
                animation: draw-check 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                animation-delay: 0.2s;
              }
            `}
          </style>
        </defs>

        <rect x="230" y="40" width="340" height="280" rx="28" fill={subColor} filter="url(#success-shadow)" />
        
        {/* Зеленый круг успеха */}
        <circle cx="400" cy="180" r="60" fill="#39e5ac" filter="url(#success-shadow)" />
        
        {/* Анимированная галочка */}
        <path 
          d="M365 180 L390 205 L445 150" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animated-check"
        />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem', padding: '0 16px', marginTop: '1rem' }}>
        <h2 style={{ margin: 0, fontFamily: 'Montserrat, system-ui, sans-serif', fontWeight: 'bold', fontSize: '1.5rem', lineHeight: 1.3, color: titleColor }}>
          Авторизация успешна
        </h2>
        <p style={{ margin: 0, fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', fontWeight: 500, lineHeight: 1.5, color: textColor }}>
          Сессия успешно инициализирована. Добро пожаловать в закрытый контур PravoSleva!
        </p>
      </div>
    </div>
  )
}
