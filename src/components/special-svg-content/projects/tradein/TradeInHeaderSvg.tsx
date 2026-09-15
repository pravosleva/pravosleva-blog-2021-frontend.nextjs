// src/components/Svg/TradeInHeaderSvg.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

interface ITradeInHeaderProps {
  message?: string
}

export const TradeInHeaderSvg: React.FC<ITradeInHeaderProps> = ({
  message = 'Профессиональный инструмент для автоматизированной оценки стоимости б/у устройств, калькуляции выгоды обмена и мгновенного оформления сделок Trade-in.'
}) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  
  const primaryColor = isDark ? '#FF8E53' : '#0162c8' // Оранжевый или синий неон
  const subColor = isDark ? '#3a3a3a' : '#f0f0f0'
  const textColor = isDark ? '#b0b0b0' : '#4a4a4a'
  const titleColor = isDark ? '#ffffff' : '#111111'

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%',
        maxWidth: '550px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      {/* 📱 СТАБИЛИЗИРОВАННАЯ СТАНЦИЯ TRADE-IN */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }} 
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="tradein-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.12" />
          </filter>
          
          <style>
            {`
              @keyframes orbit-flow {
                0% { stroke-dashoffset: 40; }
                100% { stroke-dashoffset: 0; }
              }
              @keyframes neon-glow {
                0% { stroke-opacity: 0.3; stroke-width: 2; }
                50% { stroke-opacity: 1; stroke-width: 4; }
                100% { stroke-opacity: 0.3; stroke-width: 2; }
              }
              .orbit-dots {
                stroke-dasharray: 8, 6;
                animation: orbit-flow 1.4s linear infinite;
              }
              .neon-breath {
                animation: neon-glow 2s ease-in-out infinite;
              }
              .pulse-dot {
                animation: orbit-flow 1s linear infinite;
                stroke-dasharray: 4, 3;
              }
            `}
          </style>
        </defs>

        {/* Задний технологический бокс-подложка */}
        <rect x="230" y="30" width="340" height="300" rx="28" fill={subColor} filter="url(#tradein-shadow)" />

        {/* 🔄 СИНХРОННЫЕ КРУГОВЫЕ ОРБИТЫ ОБМЕНА (ИСПРАВЛЕНО: Бегущие лучи вместо вращения тегов) */}
        <circle cx="400" cy="180" r="105" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.12" />
        <circle cx="400" cy="180" r="105" fill="none" stroke={primaryColor} strokeWidth="2" className="orbit-dots" opacity="0.4" />

        {/* 📱 ЛЕВЫЙ ЭЛЕМЕНТ: СТАРЫЙ Б/У ТЕЛЕФОН (Координаты жестко зафиксированы) */}
        <g transform="translate(290, 110)">
          {/* Корпус б/у гаджета */}
          <rect x="0" y="0" width="80" height="140" rx="12" fill={isDark ? '#232328' : '#e0e0e0'} stroke={isDark ? '#444' : '#ccc'} strokeWidth="2" />
          {/* Экран */}
          <rect x="6" y="10" width="68" height="105" rx="4" fill={isDark ? '#141417' : '#f5f5f5'} />
          {/* Царапины/трещины */}
          <path d="M 22 35 L 42 60 L 32 85" fill="none" stroke={isDark ? '#2d2d35' : '#d5d5d5'} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <circle cx="40" cy="127" r="4" fill={isDark ? '#444' : '#ccc'} />
        </g>

        {/* ⚡ МОСТ СИНХРОНИЗАЦИИ ДАННЫХ (Центральный узел) */}
        <line x1="380" y1="180" x2="420" y2="180" stroke={isDark ? '#444' : '#ccc'} strokeWidth="4" strokeLinecap="round" />
        <line x1="380" y1="180" x2="420" y2="180" stroke="#39e5ac" strokeWidth="2" strokeLinecap="round" className="pulse-dot" />

        {/* 📱 ПРАВЫЙ ЭЛЕМЕНТ: НОВЫЙ ФЛАГМАН (ИСПРАВЛЕНО: Без scale, только неоновое дыхание обводки) */}
        <g transform="translate(430, 110)">
          {/* Фоны нового смартфона */}
          <rect x="0" y="0" width="80" height="140" rx="14" fill={isDark ? '#2e2e34' : '#ffffff'} stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="1" />
          {/* Безрамочный экран */}
          <rect x="5" y="6" width="70" height="128" rx="10" fill={isDark ? '#1a1a1f' : '#f9f9f9'} />
          
          {/* Неоновый график выгоды Trade-in */}
          <path d="M 15 105 Q 35 60 45 80 T 65 45" fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
          
          {/* Динамический остров камеры */}
          <rect x="28" y="12" width="24" height="5" rx="2.5" fill={isDark ? '#222' : '#ddd'} />
          
          {/* Мягкое неоновое дыхание корпуса (Признак новизны устройства) */}
          <rect x="-1" y="-1" width="82" height="142" rx="15" fill="none" stroke={primaryColor} strokeWidth="3" className="neon-breath" strokeLinecap="round" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem', padding: '0 16px', marginTop: '0.5rem', width: '100%' }}>
        <h1 style={{ margin: 0, fontFamily: 'Montserrat, system-ui, sans-serif', fontWeight: 'bold', fontSize: '1.6rem', lineHeight: 1.3, color: titleColor }}>
          Сервис Trade-in
        </h1>
        <p style={{ margin: 0, fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', fontWeight: 500, lineHeight: 1.5, color: textColor }}>
          {message}
        </p>
      </div>
    </div>
  )
}
