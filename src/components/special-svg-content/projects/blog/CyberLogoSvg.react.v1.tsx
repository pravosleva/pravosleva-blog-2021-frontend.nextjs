import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

interface ICyberLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string; // Кастомный шорткат для быстрой настройки
}

export const CyberLogoSvg: React.FC<ICyberLogoProps> = ({ 
  size, 
  width, 
  height, 
  style,
  ...restProps // Собираем все остальные пропсы (onClick, className, и т.д.)
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'

  // 🔮 РЕАКТИВНЫЙ НЕОН: На темной теме логотип горит оранжевым, на светлой — глубоким синим!
  const neonColor = isDark ? '#FF8E53' : '#0162c8'
  const baseLineColor = isDark ? '#44444c' : '#cccccc'

  // Вычисляем финальные размеры: приоритет у size, затем у индивидуальных width/height, затем дефолтные 48
  const finalWidth = size || width || 48
  const finalHeight = size || height || 48

  return (
    <div 
      className="cyber-logo-container" 
      style={{ 
        width: size, 
        height: size, 
        display: 'inline-block', 
        overflow: 'visible' 
      }}
    >
      <svg
        viewBox="0 0 100 100" 
        width={finalWidth} 
        height={finalHeight} 
        xmlns="http://w3.org"
        style={{ overflow: 'visible', display: 'block', ...style }}
        {...restProps} // Пробрасываем все нативные атрибуты (например onClick={...})
      >
        <defs>
          {/* 🔥 ЭФФЕКТ МЯГКОГО НЕОНОВОГО СВЕЧЕНИЯ */}
          <filter id="neon-glow-effect" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Радужный градиент для внешнего кольца из оригинального арта */}
          <linearGradient id="cyber-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff3b30" />
            <stop offset="50%" stopColor="#39e5ac" />
            <stop offset="100%" stopColor="#0162c8" />
          </linearGradient>
        </defs>

        {/* 1. Идеальное внешнее радужное кольцо-подложка */}
        <circle 
          cx="50" 
          cy="50" 
          r="44" 
          fill="none" 
          stroke="url(#cyber-rainbow)" 
          strokeWidth="1.8" 
          opacity="0.65" 
        />

        {/* Группа элементов лика с применением неонового фильтра */}
        <g filter="url(#neon-glow-effect)">
          
          {/* 2. Контур классического лица (Античные симметричные линии) */}
          <path 
            d="M 32 38 C 32 25, 68 25, 68 38 C 68 52, 59 62, 56 70 L 54 78 L 46 78 L 44 70 C 41 62, 32 52, 32 38 Z" 
            fill="none" 
            stroke={neonColor} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* Линия носа и бровей */}
          <path 
            d="M 44 36 L 50 36 L 50 56 L 46 59 L 54 59" 
            fill="none" 
            stroke={neonColor} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Волевой рот */}
          <path d="M 44 68 Q 50 65, 56 68" fill="none" stroke={neonColor} strokeWidth="2" strokeLinecap="round" />
          <path d="M 46 71 H 54" fill="none" stroke={neonColor} strokeWidth="1.5" strokeLinecap="round" />

          {/* 3. Змеи/Кудри волос (Стилизованная кибер-геометрия) */}
          <path d="M 32 30 Q 20 25, 24 16 Q 30 20, 36 26" fill="none" stroke={baseLineColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 68 30 Q 80 25, 76 16 Q 70 20, 64 26" fill="none" stroke={baseLineColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 28 42 Q 14 45, 18 55 Q 26 50, 30 46" fill="none" stroke={baseLineColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 72 42 Q 86 45, 82 55 Q 74 50, 70 46" fill="none" stroke={baseLineColor} strokeWidth="1.8" strokeLinecap="round" />

          {/* 4. ЛЕГЕНДАРНЫЕ КИБЕР-ГЛАЗА И ЛАЗЕРНЫЕ ЛУЧИ (Бьют строго вниз, прорезая бампер) */}
          {/* Левый глаз */}
          <rect x="38" y="42" width="7" height="4" rx="1.5" fill="none" stroke="#ff3b30" strokeWidth="1.5" />
          <line x1="41.5" y1="44" x2="41.5" y2="96" stroke="#ff3b30" strokeWidth="1.3" strokeDasharray="4, 3" />

          {/* Правый глаз */}
          <rect x="55" y="42" width="7" height="4" rx="1.5" fill="none" stroke="#ff3b30" strokeWidth="1.5" />
          <line x1="58.5" y1="44" x2="58.5" y2="96" stroke="#ff3b30" strokeWidth="1.3" strokeDasharray="4, 3" />
        </g>
      </svg>
    </div>
  )
}
