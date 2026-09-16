import React, { CSSProperties } from 'react';

interface CatProps {
  size?: number; // Настройка размера в пикселях
  color?: string; // Основной цвет кота (например, "#546E7A", "gray", "black")
  style?: CSSProperties;
  hasPartyHat?: boolean; // 🔥 НОВОЕ: Включает праздничный колпак
}

export const Cat: React.FC<CatProps> = ({ 
  size = 40, 
  color = '#546E7A', // Тёмно-серый цвет по умолчанию
  style,
  hasPartyHat = false // По умолчанию кот без колпака
}) => {
  return (
    <div 
      className="widget-cat" 
      style={{ ...(style || {}), width: size, height: size }}
    >
      <svg 
        xmlns="http://w3.org" 
        viewBox="0 0 64 64" 
        width="100%" 
        height="100%"
        style={{ overflow: 'visible' }} // Чтобы помпон не обрезался сверху
      >
        <defs>
          {/* Магия: фильтр, который делает примененный к нему цвет темнее на ~20% */}
          <filter id="darken-shadow">
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.8" />
              <feFuncG type="linear" slope="0.8" />
              <feFuncB type="linear" slope="0.8" />
            </feComponentTransfer>
          </filter>
          
          <style>
            {`
              @keyframes hat-bob {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-1.5px); }
              }
              .party-pompon {
                animation: hat-bob 0.8s ease-in-out infinite alternate;
                transform-origin: 32px 4px;
              }
            `}
          </style>
        </defs>

        {/* Хвост — красится в основной цвет, но за счет фильтра становится темнее */}
        <path 
          d="M46 54 C54 54, 52 44, 46 44 C42 44, 42 50, 38 52" 
          fill="none" 
          stroke={color} 
          strokeWidth="5" 
          strokeLinecap="round" 
          filter="url(#darken-shadow)"
        />
        
        {/* Большое округлое туловище — основной цвет */}
        <path d="M16 58 C14 40, 22 28, 32 28 C42 28, 50 40, 48 58 Z" fill={color} />
        
        {/* Передние лапки — темнее основного цвета за счет фильтра */}
        <rect x="25" y="48" width="5" height="10" rx="2.5" fill={color} filter="url(#darken-shadow)" />
        <rect x="34" y="48" width="5" height="10" rx="2.5" fill={color} filter="url(#darken-shadow)" />
        
        {/* Маленькая голова — основной цвет */}
        <circle cx="32" cy="22" r="9" fill={color} />
        
        {/* Левое ушко */}
        <path d="M24 18 L22 10 L29 15 Z" fill={color} filter="url(#darken-shadow)" />
        <path d="M25 17 L23 12 L28 15 Z" fill="#FFCDD2" /> {/* Розовая серединка */}
        
        {/* Правое ушко */}
        <path d="M40 18 L42 10 L35 15 Z" fill={color} filter="url(#darken-shadow)" />
        <path d="M39 17 L41 12 L36 15 Z" fill="#FFCDD2" /> {/* Розовая серединка */}

        {/* ========================================================================= */}
        {/* 🥳 ПРАЗДНИЧНЫЙ КОЛПАК (Рендерится строго по условию пропса) */}
        {/* ========================================================================= */}
        {hasPartyHat && (
          <g id="cat-party-hat" filter="url(#dna-glow-shadow)">
            {/* Основание колпака (Конус) — яркий праздничный неон */}
            <polygon 
              points="25,15 39,15 32,3" 
              fill="#FF8E53" // Оранжевый фирменный неон
              stroke="#ffffff" 
              strokeWidth="1" 
              strokeLinejoin="round" 
            />
            {/* Диагональные праздничные полоски на колпаке */}
            <path d="M 28 11 L 35 15" stroke="#39e5ac" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 30 7 L 37 11" stroke="#FFEB3B" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Анимированный пушистый помпон на макушке конуса */}
            <circle 
              cx="32" 
              cy="3" 
              r="2.5" 
              fill="red" // Желтый неон
              className="party-pompon" 
            />
          </g>
        )}
        
        {/* Большие выразительные жёлтые глаза */}
        <circle cx="28.5" cy="21" r="2.3" fill="#FFEB3B" /> {/* Левый жёлтый белок */}
        <circle cx="28.5" cy="21" r="1.3" fill="#212121" />   {/* Левый зрачок */}
        
        <circle cx="35.5" cy="21" r="2.3" fill="#FFEB3B" /> {/* Правый жёлтый белок */}
        <circle cx="35.5" cy="21" r="1.3" fill="#212121" />   {/* Правый зрачок */}
        
        {/* Розовый носик */}
        <polygon points="31,23 33,23 32,24.2" fill="#FF8A80" />
        
        {/* Милые усики */}
        <line x1="21" y1="23" x2="26" y2="23" stroke="#CFD8DC" strokeWidth="1" strokeLinecap="round" />
        <line x1="22" y1="25" x2="26" y2="24" stroke="#CFD8DC" strokeWidth="1" strokeLinecap="round" />
        <line x1="43" y1="23" x2="38" y2="23" stroke="#CFD8DC" strokeWidth="1" strokeLinecap="round" />
        <line x1="42" y1="25" x2="38" y2="24" stroke="#CFD8DC" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
};
