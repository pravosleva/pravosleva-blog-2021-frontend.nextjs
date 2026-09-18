import * as React from 'react';
import { useSelector } from 'react-redux';
import { getLabelBgColor, getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils';
import { IRootState } from '~/store/IRootState';

export const RetroDiceIntroSvg = () => {
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
      {/* 📐 КЛИПИРОВАННЫЙ ВЬЮБОКС 800x150: Лишнее пустое пространство полностью ликвидировано */}
      <svg
        className='retro-dice-logo-svg'
        viewBox="0 0 800 150" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
        xmlns="http://w3.org"
      >
        <defs>
          {/* Мягкая тень для объемного 3D-эффекта букв и металла */}
          <filter id="text-art-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.06" />
          </filter>
          
          {/* 🎯 МАСКА ДЛЯ ВЫСЕКАНИЯ ВНЕШНИХ ВЫЕМОК (ДОЛОВ) БАРАБАНА */}
          {/* ФИКС КООРДИНАТ: Все точки cy смещены на -100px под новый центр Y=75 */}
          <mask id="revolver-cylinder-mask">
            <rect x="300" y="-30" width="200" height="210" fill="#ffffff" />
            {/* 6 выемок, расположенных строго между каморами для рельефа */}
            <circle cx="400" cy="17"  r="12" fill="#000000" />
            <circle cx="450" cy="46"  r="12" fill="#000000" />
            <circle cx="450" cy="104" r="12" fill="#000000" />
            <circle cx="400" cy="133" r="12" fill="#000000" />
            <circle cx="350" cy="104" r="12" fill="#000000" />
            <circle cx="350" cy="46"  r="12" fill="#000000" />
          </mask>

          <style>
            {`
              .retro-dice-logo-svg {
                width: 100%;
                /* border: 1px dashed red; */
              }
              @keyframes pulse-radar {
                0% { r: 15px; opacity: 0.8; }
                100% { r: 75px; opacity: 0; }
              }
              .radar-circle { animation: pulse-radar 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
            `}
          </style>
        </defs>

        {/* 🎯 СИСТЕМА ВНЕШНИХ КОЛЕЦ: Перенесена на новую центральную ось Y = 75 */}
        <circle cx="400" cy="75" r="35" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.25" />
        <circle cx="400" cy="75" r="85" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.12" />
        <circle cx="400" cy="75" r="145" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.05" />
        <circle cx="400" cy="75" className="radar-circle" fill="none" stroke={primaryColor} strokeWidth="2.5" />

        {/* 🔤 СЛОВО "Retro" (Базовая линия Y скорректирована до 112) */}
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
          Retro
        </text>
        
        {/* 🔤 СЛОВО "Dice" (Базовая линия Y скорректирована до 112) */}
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
          Dice
        </text>

        {/* ========================================================================= */}
        {/* 🔫 РЕЛЬЕФНЫЙ ШЕСТИЗАРЯДНЫЙ БАРАБАН: Сдвинут по оси Y на -100px (cy=75) */}
        {/* ========================================================================= */}
        <g id="revolver-cylinder" filter="url(#text-art-shadow)">
          
          {/* Применяем маску к основному телу барабана для получения внешних пазов */}
          <g mask="url(#revolver-cylinder-mask)">
            {/* Тостый внешний стальной контур (strokeWidth: 12) */}
            <circle cx="400" cy="75" r="46" fill={subColor} stroke={primaryColor} strokeWidth="12" />
          </g>
          
          {/* Внутренняя рельефная фаска */}
          <circle cx="400" cy="75" r="41" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.25" />
          
          {/* Central массивный штифт (ось экстрактора) */}
          <circle cx="400" cy="75" r="8" fill={primaryColor} />

          {/* ⚪ 6 ЧЁТКИХ БЕЛЫХ ОТВЕРСТИЙ ДЛЯ ПАТРОНОВ (КАМОРЫ): Смещены на -100px по Y */}
          <circle cx="400" cy="51" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" /> {/* 12 часов */}
          <circle cx="421" cy="63" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 2 часа */}
          <circle cx="421" cy="87" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 4 часа */}
          <circle cx="400" cy="99" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 6 часов */}
          <circle cx="379" cy="87" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 8 часов */}
          <circle cx="379" cy="63" r="7" fill="#ffffff" stroke={primaryColor} strokeWidth="2" />  {/* 10 часов */}

        </g>

      </svg>
    </div>
  )
}
