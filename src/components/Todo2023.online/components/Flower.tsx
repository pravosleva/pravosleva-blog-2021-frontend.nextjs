import React, { CSSProperties } from 'react';

interface FlowerProps {
  size?: number; // Настройка размера в пикселях
  style?: CSSProperties; // Для инлайновых смещений
}

export const Flower: React.FC<FlowerProps> = ({ size = 40, style }) => {
  return (
    <div 
      className="widget-cactus" // Используем тот же класс для преемственности CSS
      style={{ ...(style || {}), width: size, height: size }}
    >
      <div>
        <svg 
          xmlns="http://w3.org" 
          viewBox="0 0 64 64" 
          width="100%" 
          height="100%"
        >
          <defs>
            {/* Наш проверенный фильтр для автоматического затенения деталей */}
            <filter id="flower-darken">
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.8" />
                <feFuncG type="linear" slope="0.8" />
                <feFuncB type="linear" slope="0.8" />
              </feComponentTransfer>
            </filter>
          </defs>

          {/* Нижняя часть горшка */}
          <path d="M18 44 L22 58 H42 L46 44 Z" fill="#FF8A65" />
          {/* Ободок горшка — затеняем фильтром для объема */}
          <path d="M16 38 H48 V44 H16 Z" fill="#FF8A65" filter="url(#flower-darken)" rx="2" />
          {/* Земля */}
          <ellipse cx="32" cy="39" rx="14" ry="3" fill="#6d4c41" />

          {/* Листья цветка */}
          <path d="M32 38 Q22 28 24 18 Q30 26 32 38" fill="#81C784" /> {/* Левый лист */}
          <path d="M32 38 Q42 28 40 18 Q34 26 32 38" fill="#81C784" filter="url(#flower-darken)" /> {/* Правый лист (темнее) */}
          
          {/* Стебель */}
          <path d="M32 38 V18" stroke="#66BB6A" strokeWidth="3" strokeLinecap="round" />

          {/* Розовый бутон цветка */}
          <path d="M32 8 C26 8 25 18 32 20 C39 18 38 8 32 8 Z" fill="#F06292" /> {/* Задние лепестки */}
          <path d="M32 10 C29 10 28 18 32 20 C36 18 35 10 32 10 Z" fill="#F48FB1" /> {/* Центральный лепесток */}
        </svg>
      </div>
    </div>
  );
};
