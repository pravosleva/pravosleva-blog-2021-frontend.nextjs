import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { withDayOfWeek } from './withDayOfWeek';

interface ICyberLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  isMondayMode?: boolean; // Статус понедельника от нашего нативного HOC
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

  // 🔮 РЕАКТИВНЫЙ НЕОН: Оранжевый для темной темы, синий — для светлой
  const neonColor = isDark ? '#FF8E53' : '#0162c8'
  const accentColor = '#39e5ac' // Кислотно-зеленый неон для очков и галстука в понедельник
  const balloonBg = isDark ? '#1e1e24' : '#ffffff'

  const finalWidth = size || width || 48
  const finalHeight = size || height || 48

  return (
    <div 
      className="cyber-logo-wrapper" 
      style={{ display: 'inline-block', position: 'relative', overflow: 'visible' }}
    >
      {/* 🔥 CSS-АНИМАЦИИ: Инжектируем стили для мерцания, парения и поочередного включения символов */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glitch-flash {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
        @keyframes matrix-pulse {
          0% { opacity: 0.4; }
          100% { opacity: 0.9; }
        }
        /* Анимация для ПРАВОГО балуна: увеличен масштаб до scale(1.4) и scale(1.6) */
        @keyframes balloon-float-right {
          0%, 100% { opacity: 0; transform: translate(0px, 0px) scale(1.1); }
          15%, 45% { opacity: 1; transform: translate(4px, -5px) scale(1.5); }
          55% { opacity: 0; transform: translate(0px, -8px) scale(1.1); }
        }
        /* Анимация для ЛЕВОГО балуна: увеличен масштаб до scale(1.4) и scale(1.6) */
        @keyframes balloon-float-left {
          0%, 55% { opacity: 0; transform: translate(0px, 0px) scale(1.1); }
          65%, 90% { opacity: 1; transform: translate(-4px, -4px) scale(1.5); }
          95%, 100% { opacity: 0; transform: translate(0px, -7px) scale(1.1); }
        }
        /* 🎯 ТАЙМЛАЙН ГЛИТЧА: Делим цикл анимации на n фаз по x% времени */
        @keyframes cycle-char-1 { 
          0%, 16.5% { display: inline; } 
          16.6%, 100% { display: none; } 
        }
        @keyframes cycle-char-2 { 
          0%, 16.5% { display: none; } 
          16.6%, 33.2% { display: inline; } 
          33.3%, 100% { display: none; } 
        }
        @keyframes cycle-char-3 { 
          0%, 33.2% { display: none; } 
          33.3%, 49.9% { display: inline; } 
          50%, 100% { display: none; } 
        }
        @keyframes cycle-char-4 { 
          0%, 49.9% { display: none; } 
          50%, 66.5% { display: inline; } 
          66.6%, 100% { display: none; } 
        }
        @keyframes cycle-char-5 { 
          0%, 66.5% { display: none; } 
          66.6%, 83.2% { display: inline; } 
          83.3%, 100% { display: none; } 
        }
        @keyframes cycle-char-6 { 
          0%, 83.2% { display: none; } 
          83.3%, 100% { display: inline; } 
        }
        .detonation-pixel-1 { animation: glitch-flash 0.6s ease-in-out infinite; }
        .detonation-pixel-3 { animation: glitch-flash 1.4s ease-in-out infinite 0.4s; }
        .static-brain-matrix { animation: matrix-pulse 1.5s ease-in-out infinite alternate; }
        
        .balloon-q { animation: balloon-float-right 10s ease-in-out infinite; }
        .balloon-excl { animation: balloon-float-left 10s ease-in-out infinite; }

        /* Назначаем таймлайны на классы наших символов */
        .ts-char-1 { animation: cycle-char-1 4s steps(1) infinite; }
        .ts-char-2 { animation: cycle-char-2 4s steps(1) infinite; }
        .ts-char-3 { animation: cycle-char-3 4s steps(1) infinite; }
        .ts-char-4 { animation: cycle-char-4 4s steps(1) infinite; }
        .ts-char-5 { animation: cycle-char-5 4s steps(1) infinite; }
        .ts-char-6 { animation: cycle-char-6 4s steps(1) infinite; }
      `}} />

      <svg 
        viewBox="0 0 100 100" 
        width={finalWidth} 
        height={finalHeight} 
        xmlns="http://w3.org"
        style={{ overflow: 'visible', display: 'block', ...style }}
        {...restProps}
      >
        <defs>
          <filter id="cyber-statue-glow" x="-40%" y="-40%" width="180%" height="180%">
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
        </defs>

        {/* 1. Внешнее радужное кольцо-нимб */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#cyber-rainbow-ring)" strokeWidth="1.5" opacity="0.4" />

        {/* Основная группа лика и костюма с применением неонового фильтра */}
        <g filter="url(#cyber-statue-glow)">
          
          {/* 🏛️ 2. ИДЕАЛЬНЫЙ АНТИЧНЫЙ КОНТУР ЛИЦА (Ровный и симметричный) */}
          <path 
            d="M 32 38 
               C 32 20, 40 12, 50 12 
               C 60 12, 68 20, 68 38 
               C 68 54, 59 64, 56 70 
               L 54 75 
               L 46 75 
               L 44 70 
               C 41 64, 32 54, 32 38 Z" 
            fill="none" 
            stroke={neonColor} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Строгий греческий нос и прямые надбровные дуги */}
          <path d="M 43 35 H 57 M 50 35 L 50 53 L 46 56 L 54 56" fill="none" stroke={neonColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Дерзкий кибер-оскал с зубами */}
          <path d="M 40 63 C 43 69, 57 69, 60 63 C 57 61, 43 61, 40 63 Z" fill={isDark ? 'rgba(255, 142, 83, 0.1)' : 'rgba(1, 98, 200, 0.1)'} stroke={neonColor} strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="45" y1="62" x2="45" y2="65" stroke={neonColor} strokeWidth="1.5" />
          <line x1="50" y1="62" x2="50" y2="66" stroke={neonColor} strokeWidth="1.5" />
          <line x1="55" y1="62" x2="55" y2="65" stroke={neonColor} strokeWidth="1.5" />
          <path d="M 39 62 Q 40 64, 41 63" fill="none" stroke={neonColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M 61 62 Q 60 64, 59 62" fill="none" stroke={neonColor} strokeWidth="2" strokeLinecap="round" />

          {/* 👔 3. ЛАКОНИЧНЫЙ БИЗНЕС-КОСТЮМ (Ваша модификация с широкими плечами) */}
          <g fill="none" stroke={neonColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 44 76 L 39 81 L 47 83" />
            <path d="M 56 76 L 61 81 L 53 83" />
            
            <path d="M 34 83 L 15 90 L 12 99" />
            <path d="M 66 83 L 90 90 L 93 99" />
            
            <path d="M 39 81 L 47 96" />
            <path d="M 61 81 L 53 96" />

            <path 
              d="M 48 83 L 52 83 L 53 93 L 50 97 L 47 93 Z" 
              fill={isMondayMode ? accentColor : 'none'} 
              stroke={isMondayMode ? accentColor : neonColor} 
              strokeWidth="2" 
            />
          </g>

          {/* 🧠 4. РАСШИРЕННАЯ МАТРИЦА МОЗГА (Цифровое испарение и затухание квантов) */}
          <g stroke="none" fill={neonColor}>
            {/* ЯРУС 1 (Внутри черепа) */}
            <g opacity="0.45" className="static-brain-matrix">
              <rect x="39" y="26" width="4" height="4" />
              <rect x="45" y="26" width="4" height="4" />
              <rect x="51" y="26" width="4" height="4" />
              <rect x="57" y="26" width="4" height="4" />
              <rect x="42" y="20" width="4" height="4" />
              <rect x="54" y="20" width="4" height="4" />
              <rect x="47" y="15" width="6" height="4" />
            </g>
            {/* ЯРУС 2 (Выход за рамки черепа) */}
            <g opacity="0.3" className="detonation-pixel-1">
              <rect x="36" y="13" width="2.5" height="2.5" />
              <rect x="61" y="13" width="2.5" height="2.5" />
              <rect x="40" y="9" width="2.5" height="2.5" />
              <rect x="57" y="9" width="2.5" height="2.5" />
              <rect x="48" y="7" width="2.5" height="2.5" />
            </g>
            {/* ЯРУС 3 (Высший эшелон испарения) */}
            <g opacity="0.15" className="detonation-pixel-3">
              <rect x="32" y="7" width="1.2" height="1.2" />
              <rect x="66" y="7" width="1.2" height="1.2" />
              <rect x="44" y="3" width="1.2" height="1.2" />
              <rect x="54" y="3" width="1.2" height="1.2" />
              <rect x="49" y="0" width="1.2" height="1.2" fill={isMondayMode ? accentColor : neonColor} />
            </g>
          </g>

          {/* 👁️ 5. ВЗГЛЯД / ДЕЛОВЫЕ ОЧКИ ПОНЕДЕЛЬНИКА */}
          {isMondayMode ? (
            <g id="monday-glasses" fill="#141417" stroke={accentColor} strokeWidth="1.5" strokeLinejoin="round">
              <polygon points="31,41 48,42 48,48 36,46 31,44" />
              <polygon points="52,42 69,41 69,44 64,48 52,48" />
              <rect x="48" y="42" width="4" height="1.5" fill={accentColor} stroke="none" />
              <rect x="34" y="43" width="2" height="2" fill="#fff" stroke="none" />
              <rect x="55" y="43" width="2" height="2" fill="#fff" stroke="none" />
            </g>
          ) : (
            <g id="party-eyes">
              <path d="M 36 44 Q 41 41, 46 44 Q 41 47, 36 44 Z" fill="none" stroke={accentColor} strokeWidth="1.8" />
              <circle cx="41" cy="44" r="1.2" fill={accentColor} />
              <path d="M 54 45 Q 59 41, 64 45" fill="none" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" />
            </g>
          )}

          {/* ========================================================================= */}
          {/* 🎈 НОВОЕ: ПЕРИОДИЧЕСКИ ПОЯВЛЯЮЩИЕСЯ БАЛУНЫ ОТЛАДКИ (СПРАВА И СЛЕВА) */}
          {/* ========================================================================= */}
          
          {/* 💬 БАЛУН А (СПРАВА): Парящее облачко со знаком вопроса "?" */}
          <g className="balloon-q" style={{ transformOrigin: '76px 30px' }}>
            {/* Контур самого физического облачка */}
            <path 
              d="M 76 30 C 76 25, 82 23, 86 23 C 90 23, 93 26, 93 30 C 93 34, 89 36, 85 36 L 82 40 L 81 36 C 78 36, 76 33, 76 30 Z" 
              fill={balloonBg} 
              stroke={neonColor} 
              strokeWidth="1.2" 
            />
            {/* Знак вопроса внутри балуна */}
            <text 
              x="85" 
              y="32" 
              fill={isDark ? '#fff' : '#000'} 
              fontSize="9" 
              fontWeight="bold" 
              fontFamily="Montserrat, Arial" 
              textAnchor="middle"
            >?</text>
          </g>

          {/* 💬 БАЛУН Б (СЛЕВА): Полностью исправленный балун со стабильным переключением символов */}
          <g className="balloon-excl" style={{ transformOrigin: '24px 34px' }}>
            {/* Контур облачка, развернутый влево */}
            <path 
              d="M 24 34 C 24 29, 18 27, 14 27 C 10 27, 7 30, 7 34 C 7 38, 11 40, 15 40 L 18 44 L 19 40 C 22 40, 24 37, 24 34 Z" 
              fill={balloonBg} 
              stroke={isMondayMode ? accentColor : '#ff3b30'} 
              strokeWidth="1.2" 
            />
            
            {/* Текстовое поле с жестко фиксированной покаскадной сменой видимости символов */}
            <text 
              x="15" 
              y="36" 
              fill={isDark ? '#fff' : '#000'} 
              fontSize="8" 
              fontWeight="bold" 
              fontFamily="monospace" 
              textAnchor="middle"
            >
              {/* 🎯 КЛАССИЧЕСКИЙ CSS-ГЛИТЧ ДЛЯ SVG: Каждый символ горит строго в свою фазу времени */}
              <tspan className="ts-char-1">!</tspan>
              <tspan className="ts-char-2">%</tspan>
              <tspan className="ts-char-3">.</tspan>
              <tspan className="ts-char-4">#</tspan>
              <tspan className="ts-char-5">...</tspan>
              <tspan className="ts-char-6" dy="1">✅</tspan>
            </text>
          </g>

        </g>
      </svg>
    </div>
  )
}

// Вместо обычного экспорта, оборачиваем логотип в созданный HOC
export const CyberLogoWithCalendar = withDayOfWeek(CyberLogoSvg);