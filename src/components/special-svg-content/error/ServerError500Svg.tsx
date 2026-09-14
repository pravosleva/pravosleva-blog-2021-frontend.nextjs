// src/components/Svg/ServerError500Svg.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils/getTextColor'
import { IRootState } from '~/store/IRootState'

interface IServerError500Props {
  message?: string
}

export const ServerError500Svg: React.FC<IServerError500Props> = ({ 
  message = 'Рантайм Express или Node.js столкнулся с непредвиденным исключением.' 
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  const primaryColor = isDark ? '#FF8E53' : '#0162c8'
  const subColor = getTextColor({ currentTheme })
  const textColor = getTextColor({ currentTheme })
  const titleColor = getTextColor({ currentTheme })

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
      {/* ГЕОМЕТРИЧЕСКИЙ ВЕКТОР 500 */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto' }}
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="server-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          <style>
            {`
              @keyframes flash-dot {
                0% { opacity: 0.2; }
                50% { opacity: 1; }
                100% { opacity: 0.2; }
              }
              .hardware-led-red { animation: flash-dot 0.8s ease-in-out infinite; }
              .hardware-led-green { animation: flash-dot 1.4s ease-in-out infinite; }
            `}
          </style>
        </defs>

        <rect x="260" y="40" width="280" height="280" rx="24" fill={subColor} filter="url(#server-shadow)" />
        
        <rect x="290" y="75" width="220" height="45" rx="8" fill={isDark ? '#2a2a30' : '#ffffff'} />
        <rect x="290" y="135" width="220" height="45" rx="8" fill={isDark ? '#2a2a30' : '#ffffff'} />
        <rect x="290" y="195" width="220" height="45" rx="8" fill={isDark ? '#2a2a30' : '#ffffff'} />
        <rect x="290" y="255" width="220" height="45" rx="8" fill={isDark ? '#2a2a30' : '#ffffff'} />

        <circle cx="315" cy="97" r="5" fill="#ff4d4d" className="hardware-led-red" />
        <circle cx="335" cy="97" r="4" fill={isDark ? '#555' : '#ccc'} />
        <circle cx="315" cy="157" r="5" fill="#ff4d4d" className="hardware-led-red" />
        <circle cx="335" cy="157" r="4" fill={primaryColor} className="hardware-led-green" />
        <circle cx="315" cy="217" r="5" fill="#ff9f43" />
        <circle cx="335" cy="217" r="4" fill={isDark ? '#555' : '#ccc'} />
        <circle cx="315" cy="277" r="5" fill={primaryColor} className="hardware-led-green" />
        <circle cx="335" cy="277" r="4" fill={primaryColor} className="hardware-led-green" />

        <line x1="370" y1="97" x2="480" y2="97" stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="4" strokeLinecap="round" />
        <line x1="370" y1="157" x2="480" y2="157" stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="4" strokeLinecap="round" />
        <line x1="370" y1="217" x2="480" y2="217" stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="4" strokeLinecap="round" />
        <line x1="370" y1="277" x2="480" y2="277" stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="4" strokeLinecap="round" />

        <circle cx="480" cy="70" r="32" fill={primaryColor} filter="url(#server-shadow)" />
        <text x="480" y="82" textAnchor="middle" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="36" fill="#ffffff">!</text>
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
          Внутренняя ошибка сервера
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
          Мы уже пинаем логи в фоновом воркере. Скоро всё починим.
        </p>
      </div>
    </div>
  )
}
