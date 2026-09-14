// src/components/Svg/BadGateway502Svg.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils/getTextColor'
import { IRootState } from '~/store/IRootState'

interface IBadGateway502Props {
  message?: string
}

export const BadGateway502Svg: React.FC<IBadGateway502Props> = ({ 
  message = 'Прокси-сервер шлюза не смог получить своевременный ответ от upstream-рантайма Node.js.' 
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  const primaryColor = isDark ? '#FF8E53' : '#0162c8' // Оранжевый или синий акцент
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
      {/* 📡 ГЕОМЕТРИЧЕСКИЙ ВЕКТОР 502 (Сломанный сетевой шлюз) */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto' }}
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="gateway-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          
          <style>
            {`
              @keyframes pulse-break {
                0% { opacity: 0.3; stroke-width: 3; }
                50% { opacity: 1; stroke-width: 5; }
                100% { opacity: 0.3; stroke-width: 3; }
              }
              @keyframes link-disconnect {
                0% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: 20; }
              }
              .broken-link {
                animation: link-disconnect 1s linear infinite;
                stroke-dasharray: 8, 6;
              }
              .alert-pulse {
                animation: pulse-break 1.2s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        {/* 🌐 Узел 1: Клиент / Прокси-шлюз (Левая серверная нода) */}
        <rect x="200" y="110" width="130" height="130" rx="20" fill={subColor} filter="url(#gateway-shadow)" />
        <rect x="220" y="140" width="90" height="20" rx="4" fill={isDark ? '#222' : '#d5d5d5'} />
        <rect x="220" y="175" width="90" height="20" rx="4" fill={isDark ? '#222' : '#d5d5d5'} />
        <circle cx="235" cy="150" r="4" fill={primaryColor} />
        <circle cx="235" cy="185" r="4" fill={primaryColor} />

        {/* 💻 Узел 2: Upstream Бэкенд (Правая серверная нода) */}
        <rect x="470" y="110" width="130" height="130" rx="20" fill={subColor} filter="url(#gateway-shadow)" />
        <rect x="490" y="140" width="90" height="20" rx="4" fill={isDark ? '#222' : '#d5d5d5'} />
        <rect x="490" y="175" width="90" height="20" rx="4" fill={isDark ? '#222' : '#d5d5d5'} />
        {/* Красные аварийные светодиоды — бэкенд не отвечает */}
        <circle cx="505" cy="150" r="4" fill="#ff4d4d" />
        <circle cx="505" cy="185" r="4" fill="#ff4d4d" />

        {/* ⚡ ЛИНИЯ СВЯЗИ: Оборванный мост шлюза */}
        <g stroke={isDark ? '#444' : '#ccc'} strokeWidth="4" strokeLinecap="round">
          {/* Левый кусок провода */}
          <line x1="330" y1="175" x2="380" y2="175" className="broken-link" stroke={primaryColor} />
          {/* Правый кусок провода */}
          <line x1="420" y1="175" x2="470" y2="175" stroke="#ff4d4d" />
        </g>

        {/* 🛑 ЗНАК РАЗРЫВА СОЕДИНЕНИЯ ПО ЦЕНТРУ */}
        <g transform="translate(400, 175)" filter="url(#gateway-shadow)">
          <circle cx="0" cy="0" r="26" fill="#ff4d4d" className="alert-pulse" />
          {/* Иконка молнии/разрыва внутри круга */}
          <path d="M-6 -12 L6 -2 L-4 4 L6 14 L-6 4 L4 -2 Z" fill="#ffffff" />
        </g>
      </svg>

      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.45rem', // Жесткая фиксация по вашему UI-гайдлайну
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
          Ошибка шлюза (502 Bad Gateway)
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
          Сервер перезагружается после деплоя или упал из-за дедлока. Попробуйте обновить страницу через минуту [1.14].
        </p>
      </div>
    </div>
  )
}
