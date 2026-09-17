import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { withDayOfWeek } from './withDayOfWeek';

interface ICyberLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  isMondayMode?: boolean; // 🔥 НОВОЕ: Флаг включения делового понедельника
}

export const CyberLogoSvg: React.FC<ICyberLogoProps> = ({ 
  size, 
  width, 
  height, 
  style,
  isMondayMode = false,
  ...restProps 
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'

  const neonColor = isDark ? '#FF8E53' : '#0162c8'
  const accentSparkColor = '#39e5ac' // Кислотно-зеленый неон для глитч-эффектов

  const finalWidth = size || width || 48
  const finalHeight = size || height || 48

  return (
    <svg 
      viewBox="0 0 100 100" 
      width={finalWidth} 
      height={finalHeight} 
      xmlns="http://w3.org"
      style={{ overflow: 'visible', display: 'block', ...style }}
      {...restProps}
    >
      <defs>
        {/* ХАЙ-ТЕК НЕОНОВОЕ СВЕЧЕНИЕ АНТИЧНОЙ СТАТУИ */}
        <filter id="cyber-statue-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="cyber-rainbow-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="50%" stopColor="#39e5ac" />
          <stop offset="100%" stopColor="#0162c8" />
          </linearGradient>

        {/* АСИНХРОННЫЙ ГЛИТЧ-МИГАНИЕ (ЦЕНТРАЛЬНЫЙ ВЗРЫВ) */}
        <style>
          {`
            @keyframes glitch-flash {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 1; }
            }
            @keyframes brain-pulse {
              0% { opacity: 0.4; }
              100% { opacity: 0.9; }
            }
            .detonation-pixel-1 { animation: glitch-flash 0.6s ease-in-out infinite; }
            .detonation-pixel-2 { animation: glitch-flash 0.9s ease-in-out infinite 0.2s; }
            .detonation-pixel-3 { animation: glitch-flash 1.2s ease-in-out infinite 0.4s; }
            .static-brain-matrix { animation: brain-pulse 1.5s ease-in-out infinite alternate; }
          `}
        </style>
      </defs>

      {/* 1. Внешнее радужное кольцо-нимб */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#cyber-rainbow-ring)" strokeWidth="1.5" opacity="0.5" />

      {/* Основная группа лика с неоновым фильтром */}
      <g filter="url(#cyber-statue-glow)">
        
        {/* 🏛️ 2. ИСТИННЫЙ АНТИЧНЫЙ КОНТУР ЛИЦА С ИНТЕГРИРОВАННЫМ ЦИФРОВЫМ ВЗРЫВОМ */}
        {/* Фикс: Убраны ложные боковые дуги-уши. Силуэт строго сужается к точеному греческому подбородку. */}
        {/* 🏛️ ИДЕАЛЬНЫЙ АНТИЧНЫЙ КОНТУР ЛИЦА (Ровный, симметричный, без повреждений) */}
        <path 
          d="M 32 38 
             C 32 20, 40 12, 50 12 
             C 60 12, 68 20, 68 38 
             C 68 54, 59 64, 56 70 
             L 54 76 
             L 46 76 
             L 44 70 
             C 41 64, 32 54, 32 38 Z" 
          fill="none" 
          stroke={neonColor} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Классический строгий греческий нос и прямые надбровные дуги */}
        <path d="M 43 35 H 57 M 50 35 L 50 53 L 46 56 L 54 56" fill="none" stroke={neonColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Наш фирменный дерзкий кибер-оскал с зубами */}
        <path d="M 40 63 C 43 69, 57 69, 60 63 C 57 61, 43 61, 40 63 Z" fill={isDark ? 'rgba(255, 142, 83, 0.1)' : 'rgba(1, 98, 200, 0.1)'} stroke={neonColor} strokeWidth="2.2" strokeLinejoin="round" />
        <line x1="45" y1="62" x2="45" y2="65" stroke={neonColor} strokeWidth="1.5" />
        <line x1="50" y1="62" x2="50" y2="66" stroke={neonColor} strokeWidth="1.5" />
        <line x1="55" y1="62" x2="55" y2="65" stroke={neonColor} strokeWidth="1.5" />
        <path d="M 39 62 Q 40 64, 41 63" fill="none" stroke={neonColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M 61 62 Q 60 64, 59 63" fill="none" stroke={neonColor} strokeWidth="2" strokeLinecap="round" />

        {/* 🧠 3. ЦЕНТРАЛЬНАЯ МАТРИЦА МОЗГА (Внутри черепа статуи) */}
        <g fill={neonColor} opacity="0.4" className="static-brain-matrix">
          <rect x="39" y="26" width="4" height="4" />
          <rect x="45" y="26" width="4" height="4" />
          <rect x="51" y="26" width="4" height="4" />
          <rect x="57" y="26" width="4" height="4" />
          <rect x="42" y="20" width="4" height="4" />
          <rect x="54" y="20" width="4" height="4" />
          <rect x="47" y="15" width="6" height="4" />
        </g>

        {/* 🤯 4. МОЩНЫЙ ВЗРЫВ МОЗГА: МЕРЦАЮЩИЕ ЦИФРОВЫЕ ИСКРЫ И КОНФЕТТИ КОДА */}
        {/* Фикс: Пунктирные линии лазеров полностью стерты. Вместо них — объемный салют разлетающихся пикселей */}
        <g stroke="none">
          {/* Поток 1: Быстрое агрессивное мерцание на самой вершине */}
          <g className="detonation-pixel-1" fill={accentSparkColor}>
            <rect x="48" y="2" width="4" height="3" />
            <rect x="36" y="6" width="3" height="3" />
            <rect x="61" y="6" width="3" height="3" />
            <circle cx="50" cy="7" r="1.2" fill="#FFEB3B" /> {/* Золотая искра инсайта */}
          </g>

          {/* Поток 2: Среднее неоновое мерцание (Боковые брызги взрыва) */}
          <g className="detonation-pixel-2" fill={neonColor}>
            <rect x="28" y="10" width="3" height="3" />
            <rect x="69" y="10" width="3" height="3" />
            <circle cx="43" cy="5" r="1.5" />
            <circle cx="57" cy="5" r="1.5" />
          </g>

          {/* Поток 3: Размеренное глубокое мерцание (Красный спектр рисков девелопмента) */}
          <g className="detonation-pixel-3" fill="#ff3b30">
            <rect x="22" y="15" width="2.5" height="2.5" />
            <rect x="75" y="15" width="2.5" height="2.5" />
            <circle cx="50" cy="0" r="1.5" /> {/* Высшая точка салюта */}
          </g>
        </g>

        {/* 👁️ 5. ВЗГЛЯД / ДЕЛОВЫЕ ОЧКИ ПОНЕДЕЛЬНИКА */}
        {isMondayMode ? (
          <g id="monday-glasses" fill="#141417" stroke={accentSparkColor} strokeWidth="1.5" strokeLinejoin="round">
            <polygon points="31,41 48,42 48,48 36,46 31,44" />
            <polygon points="52,42 69,41 69,44 64,48 52,48" />
            <rect x="48" y="42" width="4" height="1.5" fill={accentSparkColor} stroke="none" />
            <rect x="34" y="43" width="2" height="2" fill="#fff" stroke="none" />
            <rect x="55" y="43" width="2" height="2" fill="#fff" stroke="none" />
          </g>
        ) : (
          <g id="party-eyes">
            {/* Левый уверенный глаз статуи */}
            <path d="M 36 44 Q 41 41, 46 44 Q 41 47, 36 44 Z" fill="none" stroke={accentSparkColor} strokeWidth="1.8" />
            <circle cx="41" cy="44" r="1.2" fill={accentSparkColor} />
            
            {/* Правый подмигивающий глаз */}
            <path d="M 54 45 Q 59 41, 64 45" fill="none" stroke={accentSparkColor} strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  )
}

// Вместо обычного экспорта, оборачиваем логотип в созданный HOC
export const CyberLogoWithCalendar = withDayOfWeek(CyberLogoSvg);
