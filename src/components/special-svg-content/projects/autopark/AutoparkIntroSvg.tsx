import * as React from 'react';
import { useSelector } from 'react-redux';
import { getLabelBgColor, getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils';
import { IRootState } from '~/store/IRootState';

export const AutoparkIntroSvg = React.memo(() => {
  const neonOrange = '#FF8E53';       // Фирменный оранжевый неон для слова "Park"

  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const subColor = getLabelBgColor({ currentTheme })
  const textColor = getTextColor({ currentTheme })
  // const titleColor = getTextColor({ currentTheme })
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
        className='autopark-logo-svg'
        viewBox="0 0 800 150" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
        xmlns="http://w3.org"
      >
        <defs>
          {/* Мягкая тень для объемного эффекта букв и колеса */}
          <filter id="text-art-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.06" />
          </filter>
          
          <style>
            {`
              .autopark-logo-svg {
                width: 100%;
                /* border: 1px solid red; */
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

        {/* 🔤 СЛОВО "Auto" (Базовая линия Y скорректирована до 112) */}
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
          Auto
        </text>
        
        {/* 🔤 СЛОВО "Park" (Базовая линия Y скорректирована до 112) */}
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
          Park
        </text>

        {/* ========================================================================= */}
        {/* 🏎️ ЦЕНТРАЛЬНОЕ КОЛЕСО: Сдвинуто по оси Y на -100px, пропорции 5x100 сохранены */}
        {/* ========================================================================= */}
        <g id="autopark-wheel-5x100" filter="url(#text-art-shadow)">
          
          {/* Массивный внешний синий контур (Низкопрофильная шина: r=46, stroke=12) */}
          <circle cx="400" cy="75" r="46" fill={subColor} stroke={primaryColor} strokeWidth="12" />
          
          {/* Внутреннее прижимное кольцо обода диска */}
          <circle cx="400" cy="75" r="41" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.25" />
          
          {/* Центральная ступица (ось колеса) */}
          {/* <circle cx="400" cy="75" r="8" fill={primaryColor} /> */}

          {/* ⚪ 5 ИДЕАЛЬНЫХ ОТВЕРСТИЙ СТАНДАРТНОЙ РАЗБОЛТОВКИ 5х100 */}
          {/* Просчитано тригонометрически на радиусе 25px с шагом в 72 градуса относительно центра (400, 75) */}
          <circle cx="400.00" cy="50.00" r="6.5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" /> {/* 0° (12 часов) */}
          <circle cx="423.78" cy="67.27" r="6.5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 72° */}
          <circle cx="414.69" cy="95.23" r="6.5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 144° */}
          <circle cx="385.31" cy="95.23" r="6.5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 216° */}
          <circle cx="376.22" cy="67.27" r="6.5" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 288° */}

        </g>

      </svg>
    </div>
  )
})
