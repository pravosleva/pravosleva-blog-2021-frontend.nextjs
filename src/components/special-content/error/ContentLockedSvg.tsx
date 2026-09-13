import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

export const ContentLockedSvg: React.FC<{ message?: string }> = ({
  message = 'На странице ведутся технические работы или рефакторинг легаси-кода.',
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  
  // Адаптируем цвета под текущую тему вашего блога (светлая / темная / серая)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  const primaryColor = isDark ? '#FF8E53' : '#0162c8' // Оранжевый или синий акцент
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
      {/* 🔐 ЧИСТЫЙ ГЕОМЕТРИЧЕСКИЙ ВЕКТОР (БЕЗ ВШИТОГО МЕЛКОГО ТЕКСТА) */}
      <svg 
        viewBox="0 0 800 400" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto' }}
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="locked-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          
          <style>
            {`
              @keyframes lock-wobble {
                0% { transform: rotate(0deg); }
                20% { transform: rotate(-8deg); }
                40% { transform: rotate(6deg); }
                60% { transform: rotate(-4deg); }
                80% { transform: rotate(2deg); }
                100% { transform: rotate(0deg); }
              }
              .animated-lock {
                transform-origin: 400px 170px;
                animation: lock-wobble 1.2s ease-in-out infinite alternate;
                animation-delay: 0.5s;
                animation-iteration-count: 2;
              }
            `}
          </style>
        </defs>

        {/* Лист документа статьи */}
        <rect x="250" y="40" width="300" height="340" rx="16" fill={subColor} filter="url(#locked-shadow)" />
        
        {/* Строки кода */}
        <rect x="290" y="90" width="130" height="12" rx="6" fill={isDark ? '#555' : '#dcdcdc'} />
        <rect x="290" y="120" width="220" height="10" rx="5" fill={isDark ? '#444' : '#e5e5e5'} />
        <rect x="290" y="140" width="180" height="10" rx="5" fill={isDark ? '#444' : '#e5e5e5'} />
        <rect x="290" y="160" width="200" height="10" rx="5" fill={isDark ? '#444' : '#e5e5e5'} />
        <rect x="290" y="190" width="100" height="10" rx="5" fill={isDark ? '#444' : '#e5e5e5'} />

        {/* Анимированный замок */}
        <g className="animated-lock">
          <path d="M350 170 V130 C350 102 372 80 400 80 C428 80 450 102 450 130 V170" fill="none" stroke={primaryColor} strokeWidth="14" strokeLinecap="round" />
          <rect x="330" y="160" width="140" height="110" rx="20" fill={primaryColor} filter="url(#locked-shadow)" />
          <circle cx="400" cy="205" r="10" fill={subColor} />
          <path d="M395 210 L392 235 H408 L405 210 Z" fill={subColor} />
        </g>
      </svg>

      {/* 📝 HTML-СЛОЙ С КРУПНЫМ ЧИТАЕМЫМ ТЕКСТОМ И ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.45rem', // ЖЕСТКАЯ ФИКСАЦИЯ МЕЖБЛОЧНОГО РАССТОЯНИЯ
          padding: '0 16px',
          marginTop: '1rem'
        }}
      >
        <h2 
          style={{ 
            margin: 0,
            fontFamily: 'Montserrat, system-ui, sans-serif', 
            fontWeight: 'bold', 
            fontSize: '1.5rem', // 24px — жирный читаемый заголовок
            lineHeight: 1.3,
            color: titleColor
          }}
        >
          Контент временно заблокирован
        </h2>
        
        <p 
          style={{ 
            margin: 0,
            fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', 
            fontWeight: 500, 
            // fontSize: '1.05rem', // ~17px — идеальный текст для мобилок
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
            // fontSize: '1.05rem', 
            lineHeight: 1.5,
            color: textColor
          }}
        >
          Пожалуйста, загляните позже. Everything will be fine.
        </p>
      </div>
    </div>
  )
}
