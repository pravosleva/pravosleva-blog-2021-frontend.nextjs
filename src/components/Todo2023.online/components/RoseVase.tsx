import React, { CSSProperties } from 'react';

interface RoseVaseProps {
  size?: number; // Настройка размера в пикселях
  style?: CSSProperties; // Для инлайновых смещений
}

export const RoseVase: React.FC<RoseVaseProps> = ({ size = 40, style }) => {
  return (
    <div 
      className="widget-cactus" // Тот же класс для сохранения CSS-позиционирования
      style={{ ...(style || {}), width: size, height: size }}
    >
      <svg 
        xmlns="http://w3.org" 
        viewBox="0 0 64 64" 
        width="100%" 
        height="100%"
      >
        <defs>
          {/* Универсальный фильтр для создания эффекта объёма */}
          <filter id="rose-darken">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.75" />
              <feFuncG type="linear" slope="0.75" />
              <feFuncB type="linear" slope="0.75" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* 🏺 ЭЛЕГАНТНАЯ ВАЗА */}
        {/* Основание вазы */}
        <path d="M22 58 Q 16 46 20 38 L 44 38 Q 48 46 42 58 Z" fill="#4DB6AC" />
        {/* Горлышко вазы (затеняем фильтром) */}
        <ellipse cx="32" cy="38" rx="12" ry="2.5" fill="#4DB6AC" filter="url(#rose-darken)" />
        {/* Дно вазы для устойчивости на бордере */}
        <ellipse cx="32" cy="57" rx="10" ry="1.5" fill="#00695C" opacity="0.3" />

        {/* 🌿 СТЕБЛИ И ЛИСТЬЯ */}
        <path d="M32 38 V22" stroke="#2E7D32" strokeWidth="2" />
        <path d="M26 38 Q 20 28 24 20" fill="none" stroke="#2E7D32" strokeWidth="2" />
        <path d="M38 38 Q 44 26 38 18" fill="none" stroke="#2E7D32" strokeWidth="2" />
        
        {/* Листочки */}
        <path d="M21 28 Q 15 28 18 24 Z" fill="#4CAF50" />
        <path d="M41 30 Q 47 32 44 26 Z" fill="#388E3C" filter="url(#rose-darken)" />

        {/* 🌹 ЛЕВЫЙ БУТОН РОЗЫ */}
        <g transform="translate(22, 18)">
          <circle cx="0" cy="0" r="5" fill="#E91E63" />
          <path d="M-5 0 C-5 -5, 5 -5, 5 0 Z" fill="#C2185B" filter="url(#rose-darken)" />
          <path d="M-3 -2 C-3 -6, 3 -6, 3 -2 Z" fill="#FF4081" />
          {/* Чашелистик под бутоном */}
          <path d="M-4 3 L0 7 L4 3 Z" fill="#2E7D32" />
        </g>

        {/* 🌹 ПРАВЫЙ БУТОН РОЗЫ */}
        <g transform="translate(40, 16)">
          <circle cx="0" cy="0" r="4.5" fill="#E91E63" />
          <path d="M-4.5 0 C-4.5 -4.5, 4.5 -4.5, 4.5 0 Z" fill="#C2185B" filter="url(#rose-darken)" />
          <path d="M-2.5 -2 C-2.5 -5, 2.5 -5, 2.5 -2 Z" fill="#FF4081" />
          <path d="M-3.5 3 L0 6 L3.5 3 Z" fill="#2E7D32" />
        </g>

        {/* 🌹 ЦЕНТРАЛЬНАЯ БОЛЬШАЯ РОЗА */}
        <g transform="translate(32, 15)">
          {/* Внешние лепестки */}
          <circle cx="0" cy="0" r="7" fill="#D81B60" filter="url(#rose-darken)" />
          <circle cx="-2" cy="-1" r="5.5" fill="#E91E63" />
          <circle cx="2" cy="-1" r="5.5" fill="#E91E63" />
          {/* Внутренний нежный бутон */}
          <circle cx="0" cy="1" r="4" fill="#FF4081" />
          <path d="M-2 1 Q 0 -3 2 1 Z" fill="#FFF" opacity="0.3" />
          {/* Чашелистик */}
          <path d="M-5 5 L0 9 L5 5 Z" fill="#388E3C" />
        </g>
        
      </svg>
    </div>
  );
};
