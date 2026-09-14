import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { Button } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

interface INoInternetConnectionProps {
  message?: string
}

export const NoInternetConnectionSvg: React.FC<INoInternetConnectionProps> = ({ 
  message = 'Не удалось установить соединение с сервером. Пожалуйста, проверьте подключение к интернету.' 
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  const primaryColor = isDark ? '#FF8E53' : '#0162c8' // Оранжевый или синий акцент
  const subColor = isDark ? '#3a3a3a' : '#f0f0f0'
  const textColor = isDark ? '#b0b0b0' : '#4a4a4a'
  const titleColor = isDark ? '#ffffff' : '#111111'

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

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
      {/* 🌌 ГЕОМЕТРИЧЕСКИЙ ВЕКТОР СПУТНИКА СВЯЗИ */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto' }}
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="satellite-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
          <style>
            {`
              @keyframes satellite-float {
                0% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-8px) rotate(1deg); }
                100% { transform: translateY(0px) rotate(0deg); }
              }
              @keyframes pulse-wave {
                0% { opacity: 0.1; transform: scale(0.8); }
                50% { opacity: 0.8; }
                100% { opacity: 0; transform: scale(1.3); }
              }
              .animated-satellite {
                animation: satellite-float 4s ease-in-out infinite;
                transform-origin: 400px 150px;
              }
              .wave-1 { animation: pulse-wave 2s infinite; transform-origin: 400px 240px; }
              .wave-2 { animation: pulse-wave 2s infinite; animation-delay: 0.6s; transform-origin: 400px 240px; }
              .wave-3 { animation: pulse-wave 2s infinite; animation-delay: 1.2s; transform-origin: 400px 240px; }
            `}
          </style>
        </defs>

        {/* Фоновый технологический бокс */}
        <rect x="230" y="30" width="340" height="300" rx="28" fill={subColor} filter="url(#satellite-shadow)" />

        {/* Пульсирующие красные/оранжевые волны отсутствия связи (Сканирование) */}
        <circle cx="400" cy="240" r="40" fill="none" stroke={primaryColor} strokeWidth="3" className="wave-1" />
        <circle cx="400" cy="240" r="60" fill="none" stroke={primaryColor} strokeWidth="2" className="wave-2" />
        <circle cx="400" cy="240" r="80" fill="none" stroke={primaryColor} strokeWidth="1" className="wave-3" />

        {/* Анимированный спутник связи */}
        <g className="animated-satellite" filter="url(#satellite-shadow)">
          {/* Левое крыло солнечной панели */}
          <rect x="260" y="130" width="90" height="40" rx="6" fill={isDark ? '#2a2a30' : '#dcdcdc'} stroke={primaryColor} strokeWidth="2" />
          <line x1="290" y1="130" x2="290" y2="170" stroke={primaryColor} strokeWidth="1" />
          <line x1="320" y1="130" x2="320" y2="170" stroke={primaryColor} strokeWidth="1" />

          {/* Правое крыло солнечной панели */}
          <rect x="450" y="130" width="90" height="40" rx="6" fill={isDark ? '#2a2a30' : '#dcdcdc'} stroke={primaryColor} strokeWidth="2" />
          <line x1="480" y1="130" x2="480" y2="170" stroke={primaryColor} strokeWidth="1" />
          <line x1="510" y1="130" x2="510" y2="170" stroke={primaryColor} strokeWidth="1" />

          {/* Соединительные фермы крыльев */}
          <line x1="350" y1="150" x2="450" y2="150" stroke={isDark ? '#555' : '#aaa'} strokeWidth="6" />

          {/* Центральный фюзеляж спутника */}
          <rect x="375" y="110" width="50" height="80" rx="10" fill={primaryColor} />
          
          {/* Передающая тарелка антенны */}
          <path d="M360 210 C360 190 440 190 440 210 Z" fill={isDark ? '#222' : '#fff'} stroke={primaryColor} strokeWidth="2" />
          <line x1="400" y1="190" x2="400" y2="220" stroke={primaryColor} strokeWidth="4" />
          <circle cx="400" cy="225" r="4" fill="#ff4d4d" />
        </g>
      </svg>

      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.45rem',
          padding: '0 16px',
          marginTop: '1rem',
          width: '100%',
          alignItems: 'center'
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
          Утеряно соединение с сетью
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

        {/* ИНТЕРАКТИВНАЯ КНОПКА ВОССТАНОВЛЕНИЯ СЕССИИ С КВАНТОВАНИЕМ */}
        <Button 
          startIcon={<RefreshIcon />} 
          variant="contained" 
          color="primary" 
          onClick={handleReload}
          style={{ 
            fontFamily: 'Montserrat', 
            fontWeight: 'bold', 
            borderRadius: '12px', 
            padding: '10px 24px', 
            maxWidth: '280px' 
          }}
          fullWidth
        >
          Перезагрузить страницу
        </Button>
      </div>
    </div>
  )
}
