import React, { CSSProperties } from 'react';

interface CactusProps {
  size?: number;
  style?: CSSProperties;
}

export const Cactus: React.FC<CactusProps> = ({ size = 40, style }) => {
  return (
    <div 
      className="widget-cactus" 
      style={{ ...(style || {}), width: size, height: size }}
    >
      <div className="cactus-animator">
        <svg 
          xmlns="http://w3.org" // Исправлен URL схемы SVG
          viewBox="0 0 64 64" 
          width="100%" // Растягиваем SVG на всю ширину родительского контейнера
          height="100%"
        >
          <path d="M18 44 L22 58 H42 L46 44 Z" fill="#E57373" />
          <path d="M16 38 H48 V44 H16 Z" fill="#EF5350" rx="2" />
          <ellipse cx="32" cy="39" rx="14" ry="3" fill="#795548" />
          <path d="M24 20 C24 10, 38 10, 38 20 V40 H24 Z" fill="#81C784" />
          <path d="M31 12 V40" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 4" />
          <path d="M25 24 C20 24, 18 30, 24 32" fill="none" stroke="#81C784" stroke-width="6" stroke-linecap="round" />
          <path d="M39 20 C44 20, 46 26, 40 28" fill="none" stroke="#81C784" stroke-width="5" stroke-linecap="round" />
          <circle cx="31" cy="11" r="3" fill="#FF8A80" />
          <circle cx="28" cy="12" r="2.5" fill="#FF8A80" />
          <circle cx="34" cy="12" r="2.5" fill="#FF8A80" />
        </svg>
      </div>
    </div>
  );
};