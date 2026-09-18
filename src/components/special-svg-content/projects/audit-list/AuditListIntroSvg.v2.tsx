import * as React from 'react'
import { useSelector } from 'react-redux'
import { getLabelBgColor, getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'
import { IRootState } from '~/store/IRootState'

export const AuditListIntroSvg = React.memo(() => {
  const neonOrange = '#FF8E53';       // Фирменный оранжевый неон для слова "List"

  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const subColor = getLabelBgColor({ currentTheme })
  const textColor = getTextColor({ currentTheme })
  const primaryColor = currentTheme === 'hard-gray' ? textColor : '#0162c8';

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      {/* 📐 КЛИПИРОВАННЫЙ ВЬЮБОКС 800x150: Пустые поля сверху и снизу полностью ликвидированы */}
      <svg
        className='audit-list-logo-svg'
        viewBox="0 0 800 150" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
        xmlns="http://w3.org"
      >
        <defs>
          {/* Мягкая тень для объемного эффекта букв и элементов */}
          <filter id="text-art-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.06" />
          </filter>
          
          <style>
            {`
              .audit-list-logo-svg {
                width: 100%;
              }
              @keyframes pulse-radar {
                0% { r: 15px; opacity: 0.8; }
                100% { r: 75px; opacity: 0; }
              }
              .radar-circle { animation: pulse-radar 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
            `}
          </style>
        </defs>

        {/* 🎯 СИСТЕМА ВНЕШНИХ КОЛЕЦ: Смещена на новую центральную ось Y = 75 */}
        <circle cx="400" cy="75" r="35" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.25" />
        <circle cx="400" cy="75" r="85" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.12" />
        <circle cx="400" cy="75" r="145" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.05" />
        <circle cx="400" cy="75" className="radar-circle" fill="none" stroke={primaryColor} strokeWidth="2.5" />

        {/* 🔤 СЛОВО "Audit" (Базовая линия Y скорректирована до 112) */}
        <text 
          x="335" 
          y="112" 
          fontFamily="Montserrat, system-ui, -apple-system, sans-serif" 
          fontWeight="900" 
          fontSize="115" 
          fill={primaryColor}
          textAnchor="end"
          letterSpacing="-0.04em"
          filter="url(#text-art-shadow)"
        >
          Audit
        </text>
        
        {/* 🔤 СЛОВО "List" (Базовая линия Y скорректирована до 112) */}
        <text 
          x="465" 
          y="112" 
          fontFamily="Montserrat, system-ui, -apple-system, sans-serif" 
          fontWeight="900" 
          fontSize="115" 
          fill={neonOrange}
          textAnchor="start"
          letterSpacing="-0.02em"
          filter="url(#text-art-shadow)"
        >
          List
        </text>

        {/* ========================================================================= */}
        {/* 🧮 МИНИМАЛИСТИЧНЫЙ КАЛЬКУЛЯТОР: Сдвинут по оси Y на -100px (y=29), пропорции сохранены */}
        {/* ========================================================================= */}
        <g id="central-calculator" filter="url(#text-art-shadow)">
          
          {/* Корпус калькулятора (Ваши размеры: 90x92, stroke=10) */}
          <rect 
            x="356" 
            y="29" 
            width="90" 
            height="92" 
            rx="12" 
            fill={subColor} 
            stroke={primaryColor} 
            strokeWidth="10" 
            strokeLinejoin="round" 
          />
          
          {/* Схематичный дисплей сверху */}
          <rect 
            x="368" 
            y="43" 
            width="64" 
            height="16" 
            rx="3" 
            fill="#ffffff" 
            stroke={primaryColor} 
            strokeWidth="2" 
          />
          
          {/* Минималистичный индикатор значения на дисплее */}
          <line x1="374" y1="51" x2="386" y2="51" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />

          {/* ⚪ 4 ЧЁТКИЕ КНОПКИ ДЕЙСТВИЙ */}
          {/* Верхний ряд кнопок */}
          <circle cx="384" cy="77" r="7" fill={primaryColor} stroke={primaryColor} strokeWidth="2" /> {/* Левая верхняя */}
          <circle cx="418" cy="77" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" /> {/* Правая верхняя */}
          
          {/* Нижний ряд кнопок */}
          <circle cx="384" cy="101" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" /> {/* Левая нижняя */}
          <circle cx="418" cy="101" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" /> {/* Правая нижняя */}

        </g>

      </svg>
    </div>
  )
})
