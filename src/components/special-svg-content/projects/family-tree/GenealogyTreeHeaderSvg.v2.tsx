import React from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

interface IGenealogyTreeHeaderProps {
  message?: string
}

export const GenealogyTreeHeaderSvg: React.FC<IGenealogyTreeHeaderProps> = ({
  message = 'Высокопроизводительный инструмент для визуализации реляционных структур данных, построения интерактивных фамильных древ и бесшовного управления связями поколений.'
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
      {/* 🧬 МОЛЕКУЛЯРНОЕ ФАМИЛЬНОЕ ДЕРЕВО (ТРИЕДИНАЯ ДНК СТРУКТУРА) */}
      <svg 
        viewBox="0 0 800 360" 
        width="100%" 
        height="auto" 
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }} 
        xmlns="http://w3.org"
      >
        <defs>
          <filter id="dna-glow-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.12" />
          </filter>
          
          <style>
            {`
              @keyframes helix-flow {
                0% { stroke-dashoffset: 40; }
                100% { stroke-dashoffset: 0; }
              }
              @keyframes text-blink {
                0% { opacity: 0.5; fill-opacity: 0.6; }
                50% { opacity: 1; fill-opacity: 1; }
                100% { opacity: 0.5; fill-opacity: 0.6; }
              }
              @keyframes dna-float {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-6px); }
              }
              .dna-stream {
                stroke-dasharray: 6, 4;
                animation: helix-flow 1.2s linear infinite;
              }
              .chrom-text {
                animation: text-blink 1.8s ease-in-out infinite alternate;
              }
              .molecular-root {
                animation: dna-float 3s ease-in-out infinite alternate;
                transform-origin: 400px 180px;
              }
            `}
          </style>
        </defs>

        {/* Фоновый закругленный блок-подложка */}
        <rect x="230" y="30" width="340" height="300" rx="28" fill={subColor} filter="url(#dna-glow-shadow)" />

        {/* Главная плавающая группа ДНК-Дерева (0% внутренних трансформ на узлах) */}
        <g className="molecular-root" filter="url(#dna-glow-shadow)">
          
          {/* ========================================================================= */}
          {/* 🧬 ЦЕНТРАЛЬНЫЙ СТВОЛ: КРИСТАЛЬНО ОЧЕВИДНАЯ ДВОЙНАЯ СПИРАЛЬ */}
          {/* ========================================================================= */}
          {/* Горизонтальные перемычки нуклеотидов (Ступени ДНК) */}
          <line x1="384" y1="230" x2="416" y2="230" stroke={primaryColor} strokeWidth="2.5" opacity="0.6" />
          <line x1="382" y1="200" x2="418" y2="200" stroke="#39e5ac" strokeWidth="2.5" opacity="0.6" />
          <line x1="385" y1="170" x2="415" y2="170" stroke={primaryColor} strokeWidth="2.5" opacity="0.6" />

          {/* Нить А ствола (Синусоида) */}
          <path d="M 385 260 C 385 235, 415 225, 415 200 C 415 175, 385 165, 385 145" fill="none" stroke={isDark ? '#444' : '#ccc'} strokeWidth="4" strokeLinecap="round" />
          <path d="M 385 260 C 385 235, 415 225, 415 200 C 415 175, 385 165, 385 145" fill="none" stroke={primaryColor} strokeWidth="2.5" className="dna-stream" />

          {/* Нить Б ствола (Противофаза) */}
          <path d="M 415 260 C 415 235, 385 225, 385 200 C 385 175, 415 165, 415 145" fill="none" stroke={isDark ? '#444' : '#ccc'} strokeWidth="4" strokeLinecap="round" />
          <path d="M 415 260 C 415 235, 385 225, 385 200 C 385 175, 415 165, 415 145" fill="none" stroke="#39e5ac" strokeWidth="2.5" className="dna-stream" style={{ animationDelay: '0.6s' }} />
          // =========================================================================
          // 🌿 РАЗВЕТВЛЕНИЕ ВЕТВЕЙ ДНК (Уходят к родительским хромосомам)
          // =========================================================================
          
          {/* ЛЕВАЯ ВЕТВЬ ДНК (К мужской линии FATHER) */}
          {/* Перемычки-ступеньки нуклеотидов */}
          <line x1="345" y1="110" x2="375" y2="125" stroke={primaryColor} strokeWidth="2" opacity="0.5" />
          {/* Спиральные нити Безье */}
          <path d="M 400 145 Q 360 145, 340 120 T 330 85" fill="none" stroke={isDark ? '#444' : '#ccc'} strokeWidth="3" />
          <path d="M 400 145 Q 360 145, 340 120 T 330 85" fill="none" stroke={primaryColor} strokeWidth="1.5" className="dna-stream" />

          {/* ПРАВАЯ ВЕТВЬ ДНК (К женской линии MOTHER) */}
          {/* Перемычки-ступеньки нуклеотидов */}
          <line x1="455" y1="110" x2="425" y2="125" stroke="#39e5ac" strokeWidth="2" opacity="0.5" />
          {/* Спиральные нити Безье */}
          <path d="M 400 145 Q 440 145, 460 120 T 470 85" fill="none" stroke={isDark ? '#444' : '#ccc'} strokeWidth="3" />
          <path d="M 400 145 Q 440 145, 460 120 T 470 85" fill="none" stroke="#39e5ac" strokeWidth="1.5" className="dna-stream" style={{ animationDelay: '0.4s' }} />

          {/* ========================================================================= */}
          {/* ❌ ГЕНЕТИЧЕСКИЕ УЗЛЫ: ХРОМОСОМНЫЕ ПАРЫ XX / XY (ТРИЕДИНАЯ СТРУКТУРА) */}
          {/* ========================================================================= */}
          
          {/* УЗЕЛ 1: КОРЕНЬ (Основатель / Текущий профиль) */}
          <g transform="translate(400, 260)">
            <circle cx="0" cy="0" r="18" fill={isDark ? '#1a1a1f' : '#ffffff'} stroke={primaryColor} strokeWidth="2.5" />
            <text x="0" y="4" textAnchor="middle" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="12" fill={primaryColor} className="chrom-text">
              YOU
            </text>
          </g>

           {/* ЛЕВЫЙ ТОП: МУЖСКАЯ ЛИНИЯ ПРЕДКОВ (Отец) */}
          <g transform="translate(330, 85)">
            <circle cx="0" cy="0" r="18" fill={isDark ? '#1a1a1f' : '#ffffff'} stroke={primaryColor} strokeWidth="2.5" />
            <text x="0" y="4" textAnchor="middle" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="12" fill={primaryColor} className="chrom-text">
              XY
            </text>
            <text x="0" y="-24" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="bold" fontSize="10" fill={titleColor} letterSpacing="0.5px">FATHER</text>
          </g>

          {/* ПРАВЫЙ ТОП: ЖЕНСКАЯ ЛИНИЯ ПРЕДКОВ (Мать) */}
          <g transform="translate(470, 85)">
            <circle cx="0" cy="0" r="18" fill={isDark ? '#1a1a1f' : '#ffffff'} stroke="#39e5ac" strokeWidth="2.5" />
            <text x="0" y="4" textAnchor="middle" fontFamily="Montserrat, system-ui, sans-serif" fontWeight="900" fontSize="12" fill="#39e5ac" className="chrom-text">
              XX
            </text>
            <text x="0" y="-24" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="bold" fontSize="10" fill={titleColor} letterSpacing="0.5px">MOTHER</text>
          </g>

          {/* Концевые маркеры цепочек нуклеотидов */}
          <circle cx="385" cy="245" r="4" fill={primaryColor} />
          <circle cx="415" cy="245" r="4" fill="#39e5ac" />
        </g>
      </svg>
            {/* ========================================================================= */}
      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      {/* ========================================================================= */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.45rem', 
          padding: '0 16px', 
          marginTop: '0.5rem', 
          width: '100%' 
        }}
      >
        <h1 
          style={{ 
            margin: 0, 
            fontFamily: 'Montserrat, system-ui, sans-serif', 
            fontWeight: 'bold', 
            fontSize: '1.6rem', 
            lineHeight: 1.3, 
            color: titleColor 
          }}
        >
          Генеалогическое дерево
        </h1>
        <p 
          style={{ 
            margin: 0, 
            fontFamily: 'Montserrat, system-ui, -apple-system, sans-serif', 
            fontWeight: 500, 
            lineHeight: 1.5, 
            color: textColor 
          }}
        >
          {message}
        </p>
      </div>
    </div>
  )
}
