import React, { CSSProperties } from 'react';

interface HederaProps {
  size?: number; // Базовый размер горшка (ширина)
  style?: CSSProperties;
}

export const Hedera: React.FC<HederaProps> = ({ size = 40, style }) => {
  return (
    <div 
      className="widget-cactus" 
      style={{ ...(style || {}), width: size, height: size }}
    >
      <svg 
        xmlns="http://w3.org" 
        /* Расширяем viewBox вниз до 160, чтобы дать лозе свисать */
        viewBox="0 0 64 160" 
        width="100%" 
        /* Высота SVG теперь пропорционально больше, чтобы ветки не сжимались */
        height="250%" 
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="hedera-darken">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.7" />
              <feFuncG type="linear" slope="0.7" />
              <feFuncB type="linear" slope="0.7" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* СТАНДАРТНЫЙ ГОРШОК (база 64x64) */}
        <path d="M18 44 L22 58 H42 L46 44 Z" fill="#FF8A65" />
        <path d="M16 38 H48 V44 H16 Z" fill="#FF8A65" filter="url(#hedera-darken)" rx="2" />
        <ellipse cx="32" cy="39" rx="14" ry="3" fill="#6d4c41" />

        {/* ПЫШНАЯ КРОНА (Взрослый разросшийся куст) */}
        <circle cx="32" cy="32" r="9" fill="#4CAF50" />
        <circle cx="24" cy="30" r="8" fill="#388E3C" filter="url(#hedera-darken)" />
        <circle cx="40" cy="31" r="8.5" fill="#4CAF50" />
        <circle cx="18" cy="35" r="7" fill="#2E7D32" filter="url(#hedera-darken)" />
        <circle cx="46" cy="34" r="7.5" fill="#4CAF50" />
        <circle cx="32" cy="24" r="7" fill="#81C784" />

        {/* 🌿 ЛОЗА 1 (Короткая левая, прикрывает горшок) */}
        <path d="M20 42 Q 10 46 8 58 Q 6 68 12 76" fill="none" stroke="#388E3C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 48 Q 5 48 8 53 Z" fill="#4CAF50" />
        <path d="M7 60 Q 1 62 4 66 Z" fill="#2E7D32" filter="url(#hedera-darken)" />
        <path d="M10 70 Q 6 74 11 77 Z" fill="#81C784" />

        {/* 🌿 ЛОЗА 2 (Средняя центральная) */}
        <path d="M28 42 Q 24 60 28 80 Q 32 100 26 115" fill="none" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 55 Q 20 57 23 62 Z" fill="#388E3C" filter="url(#hedera-darken)" />
        <path d="M27 75 Q 33 77 30 82 Z" fill="#4CAF50" />
        <path d="M29 95 Q 23 98 26 103 Z" fill="#2E7D32" filter="url(#hedera-darken)" />
        <path d="M27 110 Q 31 113 28 116 Z" fill="#81C784" />

        {/* 🌿 ЛОЗА 3 (МЕГА-ОБЪЁМНАЯ И ДЛИННАЯ, свисает далеко вниз по правому краю виджета) */}
        <path d="M40 42 Q 52 50 48 70 Q 42 95 46 120 Q 50 140 44 155" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
        {/* Обильная листва на длинной лозе */}
        <path d="M45 50 Q 53 50 49 56 Z" fill="#4CAF50" />
        <path d="M48 65 Q 56 68 50 74 Z" fill="#388E3C" filter="url(#hedera-darken)" />
        <path d="M44 80 Q 36 84 41 89 Z" fill="#81C784" />
        <path d="M45 95 Q 52 97 48 103 Z" fill="#4CAF50" />
        <path d="M44 110 Q 37 114 42 119 Z" fill="#388E3C" filter="url(#hedera-darken)" />
        <path d="M46 128 Q 53 130 49 135 Z" fill="#81C784" />
        <path d="M46 142 Q 40 146 43 150 Z" fill="#4CAF50" />
      </svg>
    </div>
  );
};
