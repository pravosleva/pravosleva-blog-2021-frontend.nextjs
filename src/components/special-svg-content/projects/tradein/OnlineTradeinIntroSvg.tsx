import * as React from 'react';
import { useSelector } from 'react-redux';
import { getLabelBgColor, getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils';
import { IRootState } from '~/store/IRootState';

export const OnlineTradeinIntroSvg = React.memo(() => {
  const neonOrange = '#FF8E53'; // Фирменный оранжевый неон для слова "Tradein"

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
        className="online-tradein-logo-svg"
        viewBox="0 0 800 150" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="text-art-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.06" />
          </filter>
          
          <style>
            {`
              .online-tradein-logo-svg {
                /* transform: translateX(8px) scale(0.8); */
                width: 100%;
                /* Красную рамку можно будет убрать после проверки */
                /* border: 1px dashed red; */
              }
              @keyframes pulse-radar {
                0% { r: 15px; opacity: 0.8; }
                100% { r: 75px; opacity: 0; }
              }
              .radar-circle { animation: pulse-radar 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }

              @media (max-width: 600px) {
                .online-tradein-logo-svg {
                  /* transform: translateX(8px) scale(0.8) !important; */
                  transform: scale(0.8) !important;
                  transform-origin: center center !important;
                  margin: 0 auto !important;
                }
              }
            `}
          </style>
        </defs>

        {/* 🎯 СИСТЕМА КОЛЕЦ: Центрирована строго по новой оси Y = 75 */}
        <circle cx="400" cy="75" r="35" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.25" />
        <circle cx="400" cy="75" r="85" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.12" />
        <circle cx="400" cy="75" r="145" fill="none" stroke={primaryColor} strokeWidth="1" opacity="0.05" />
        <circle cx="400" cy="75" className="radar-circle" fill="none" stroke={primaryColor} strokeWidth="2.5" />

        {/* 🔤 СЛОВО "Online" (Базовая линия Y скорректирована до 112) */}
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
          Online
        </text>
        
        {/* 🔤 СЛОВО "Tradein" (Базовая линия Y скорректирована до 112) */}
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
          Tradein
        </text>

        {/* ========================================================================= */}
        {/* 📱 ЦЕНТР: СМАРТФОН И СТРЕЛКИ ВЫРАВНЕНЫ ПО НОВОМУ ЦЕНТРУ ТРАНСФОРМАЦИИ (400, 75) */}
        {/* ========================================================================= */}
        <g id="central-tradein-engine" filter="url(#text-art-shadow)">
          
          <g transform="rotate(-45 400 75)">
            
            {/* ↘️ СТРЕЛКА 1 (СЛЕВА) */}
            <g stroke={primaryColor} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1="326" y1="75" x2="344" y2="75" />
              <polygon points="346,75 332,64 332,86" fill={primaryColor} strokeWidth="1" />
            </g>

            {/* 📱 СМАРТФОН: Сдвинут по оси Y на -100px (y=29), пропорции 74x92 сохранены */}
            <rect 
              x="363" 
              y="29" 
              width="74"  
              height="92" 
              rx="11" 
              fill={subColor} 
              stroke={primaryColor} 
              strokeWidth="11" 
              strokeLinejoin="round" 
            />
            
            {/* Внутренняя разметка экрана дисплея */}
            <rect x="372" y="38" width="56" height="66" rx="3" fill="none" stroke={primaryColor} strokeWidth="2" opacity="1" />
            
            {/* Круглая кнопка Home */}
            <circle cx="400" cy="111" r="8" fill={subColor} stroke={primaryColor} strokeWidth="2" />
            
            {/* Разговорный динамик сверху */}
            <line x1="392" y1="34" x2="408" y2="34" stroke={primaryColor} strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />

            {/* ↘️ СТРЕЛКА 2 (СПРАВА) */}
            <g stroke={primaryColor} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1="454" y1="75" x2="472" y2="75" />
              <polygon points="474,75 460,64 460,86" fill={primaryColor} strokeWidth="1" />
            </g>

          </g>
          
        </g>

      </svg>
    </div>
  )
})
