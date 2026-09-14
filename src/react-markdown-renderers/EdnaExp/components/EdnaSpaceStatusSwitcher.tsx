// src/react-markdown-renderers/EdnaExp/components/EdnaSpaceStatusSwitcher.tsx
import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'
import { IRootState } from '~/store/IRootState'

export type TLoadingStatus = 'idle' | 'worker-delay' | 'fetching' | 'injecting' | 'polling-api' | 'success' | 'failed'

interface IEdnaSpaceStatusSwitcherProps {
  status: TLoadingStatus
}

export const EdnaSpaceStatusSwitcher: React.FC<IEdnaSpaceStatusSwitcherProps> = ({ status }) => {
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const isDark = currentTheme === 'dark' || currentTheme === 'hard-gray' || currentTheme === 'gray'
  
  const subColor = isDark ? '#3a3a3a' : '#f0f0f0'
  const textColor = getTextColor({ currentTheme })
  // const titleColor = isDark ? '#ffffff' : '#111111'

  const stateConfig = useMemo(() => {
    switch (status) {
      case 'idle':
        return {
          title: 'Станция в режиме ожидания',
          desc: 'Внешний сервис находится в спящем режиме рантайма. Инициализируйте запуск для отправки сигнала на орбиту.',
          color: isDark ? '#00b7ff' : '#0162c8'
        }
      case 'worker-delay':
        return {
          title: 'Инициализация воркера',
          desc: 'Потоковый движок удерживает паузу для стабилизации **Main Thread** и предотвращения блокировки интерфейса (TBT).',
          color: '#ffdd57'
        }
      case 'fetching':
        return {
          title: 'Загрузка внешнего пакета',
          desc: 'Потоковый шлюз загружает UMD-сборку скрипта стороннего сервиса с удаленного CDN...',
          color: '#ff9f43'
        }
      case 'injecting':
        return {
          title: 'Инжект скрипта в DOM-дерево',
          desc: 'Происходит динамическая сборка тега `<script>` и его бесшовная интеграция в структуру текущей страницы.',
          color: '#ff6b6b'
        }
      case 'polling-api':
        return {
          title: 'Поллинг глобального контекста window',
          desc: 'Скрипт успешно смонтирован. Выполняется циклический опрос рантайма с интервалом в ожидании `ThreadsWidget`.',
          color: '#ff8a53'
        }
      case 'success':
        return {
          title: 'Шлюз связи активен',
          desc: 'Инжект завершен. API успешно проинициализировано в `window.ThreadsWidget`. Модуль готов к приему команд.',
          color: '#00b273'
        }
      case 'failed':
      default:
        return {
          title: 'Критический обрыв связи',
          desc: 'Рантайм столкнулся с исключением при подгрузке пакета. Сверьте статус сети или сбросьте автомат.',
          color: '#d63435'
        }
    }
  }, [status, isDark])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
      
      {/* CSS-АНИМАЦИИ ВЫНЕСЕНЫ В КОРЕНЬ СТРАНИЦЫ */}
      <style>
        {`
          @keyframes html-space-float { 
            0% { transform: translateY(3px); } 
            100% { transform: translateY(-3px); } 
          }
          @keyframes inner-radar-spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
          @keyframes html-led-glow { 
            0% { opacity: 0.3; } 
            50% { opacity: 1; } 
            100% { opacity: 0.3; } 
          }
          .html-float-container { 
            /* Мягкое покачивание всего HTML-узла без обрезки краев векторов */
            animation: html-space-float 2s ease-in-out infinite alternate; 
          }
          .inner-spin-node { 
            transform-origin: 200px 110px; 
            animation: inner-radar-spin 3s linear infinite; 
          }
          .inner-glow-node { 
            animation: html-led-glow 1s ease-in-out infinite; 
          }
        `}
      </style>

      {/* ========================================================================= */}
      {/* 🧭 СЛОЙ ВЕКТОРНОЙ ГРАФИКИ (ИСПРАВЛЕНО: КОРНЕВОЕ ПЛАВАНИЕ ПОЛНОГО HTML БЛОКА) */}
      {/* ========================================================================= */}
      <div 
        className={status === 'idle' ? 'html-float-container' : undefined} 
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <svg 
          viewBox="0 0 400 220" 
          width="100%" 
          height="auto" 
          style={{ display: 'block', margin: '0 auto', overflow: 'visible' }} // overflow: visible страхует вылеты пикселей
          xmlns="http://w3.org"
        >
          <defs>
            <filter id="space-box-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Общая серверная подложка-модуль */}
          <rect x="50" y="10" width="300" height="200" rx="20" fill={subColor} filter="url(#space-box-shadow)" />

          {/* --- СЦЕНА 1: IDLE (ЖЕСТКИЕ СТАТИЧНЫЕ КООРДИНАТЫ БЕЗ ВНУТРЕННИХ СДВИГОВ) --- */}
          {status === 'idle' && (
            <g transform="translate(200, 105)">
              {/* Силовой защитный купол шлюза */}
              <circle cx="0" cy="0" r="72" fill="none" stroke={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)'} strokeWidth="2" strokeDasharray="6 4" />
              
              {/* Пульсирующие огни парковки */}
              <circle cx="-62" cy="35" r="5" fill={stateConfig.color} className="inner-glow-node" />
              <circle cx="62" cy="35" r="5" fill={stateConfig.color} className="inner-glow-node" />

              {/* Стартовая технологическая платформа */}
              <rect x="-65" y="35" width="130" height="8" rx="4" fill={isDark ? '#111111' : '#bcbcbc'} />
              <rect x="-45" y="43" width="90" height="10" fill={isDark ? '#222222' : '#999999'} />

              {/* Космический шаттл */}
              <g transform="translate(-25, -50)">
                {/* Крылья */}
                <path d="M-10 60 L10 35 L10 70 Z" fill={isDark ? '#555555' : '#888888'} stroke={isDark ? '#666666' : '#777777'} strokeWidth="1" transform="translate(10, 0)" />
                <path d="M60 60 L40 35 L40 70 Z" fill={isDark ? '#555555' : '#888888'} stroke={isDark ? '#666666' : '#777777'} strokeWidth="1" transform="translate(-10, 0)" />
                
                {/* Фюзеляж */}
                <path d="M25 0 C42 0 45 15 45 70 H5 C5 15 8 0 25 0 Z" fill={stateConfig.color} filter="url(#space-box-shadow)" />
                
                {/* Иллюминатор */}
                <circle cx="25" cy="24" r="8" fill={isDark ? '#111111' : '#ffffff'} stroke={isDark ? '#555555' : '#e0e0e0'} strokeWidth="2" />
                <path d="M22 20 Q27 18 28 24" stroke={isDark ? '#333' : '#b5e5ff'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
                
                <rect x="23" y="-3" width="4" height="4" fill={isDark ? '#fff' : '#222'} />

                {/* Сопла */}
                <rect x="12" y="70" width="8" height="6" fill={isDark ? '#111111' : '#555555'} rx="1" />
                <rect x="30" y="70" width="8" height="6" fill={isDark ? '#111111' : '#555555'} rx="1" />
              </g>
            </g>
          )}

          {/* --- СЦЕНА 2: ЗАГРУЗКА / ПОЛЛИНГ --- */}
          {status !== 'idle' && status !== 'success' && status !== 'failed' && (
            <g>
              <circle cx="200" cy="110" r="55" fill="none" stroke={stateConfig.color} strokeWidth="2" opacity="0.15" />
              <circle cx="200" cy="110" r="35" fill="none" stroke={stateConfig.color} strokeWidth="2" opacity="0.3" />
              <g className="inner-spin-node">
                <line x1="200" y1="110" x2="245" y2="75" stroke={stateConfig.color} strokeWidth="3" strokeLinecap="round" className="inner-glow-node" />
                <circle cx="245" cy="75" r="5" fill={stateConfig.color} />
              </g>
              <circle cx="200" cy="110" r="6" fill={isDark ? '#222' : '#fff'} stroke={stateConfig.color} strokeWidth="2.5" />
            </g>
          )}

          {/* --- СЦЕНА 3: SUCCESS --- */}
          {status === 'success' && (
            <g transform="translate(0, 5)">
              <rect x="80" y="90" width="100" height="60" rx="10" fill={isDark ? '#222' : '#fff'} stroke={isDark ? '#444' : '#e0e0e0'} strokeWidth="2" />
              <line x1="180" y1="120" x2="230" y2="120" stroke={stateConfig.color} strokeWidth="5" strokeDasharray="5 3" />
              <rect x="230" y="80" width="90" height="80" rx="12" fill={stateConfig.color} filter="url(#space-box-shadow)" />
              <circle cx="260" cy="110" r="5" fill="#fff" className="inner-glow-node" />
              <circle cx="290" cy="110" r="5" fill="#fff" opacity="0.5" />
              <path d="M130 90 L130 55 M120 55 H140" stroke={isDark ? '#444' : '#999'} strokeWidth="2.5" />
              <circle cx="130" cy="50" r="4" fill={stateConfig.color} className="inner-glow-node" />
            </g>
          )}

          {/* --- СЦЕНА 4: FAILED --- */}
          {status === 'failed' && (
            <g>
              <circle cx="200" cy="110" r="40" fill={isDark ? '#222' : '#e0e0e0'} stroke={stateConfig.color} strokeWidth="3" strokeDasharray="5 4" />
              <g className="inner-glow-node">
                <circle cx="200" cy="110" r="26" fill={stateConfig.color} />
                <text x="200" y="121" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="900" fontSize="32" fill="#ffffff">!</text>
              </g>
              <line x1="90" y1="110" x2="130" y2="110" stroke={stateConfig.color} strokeWidth="3" strokeLinecap="round" />
              <line x1="270" y1="110" x2="310" y2="110" stroke={stateConfig.color} strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 📝 HTML-СЛОЙ С ВЕРТИКАЛЬНЫМ ШАГОМ 1.45rem */}
      
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.45rem' }}>
        <h4 style={{ margin: '16px 0 0 0', fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontSize: '1.2rem', color: textColor }}>
          {stateConfig.title}
        </h4>
        <div
          style={{ fontSize: 'small',
            whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
            wordBreak: 'break-word', // По желанию: переносит слишком длинные слова
            backgroundColor: 'hsla(0,0%,0%,.04)',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          <ReactMarkdown children={stateConfig.desc} />
        </div>
      </div>
    </div>
  )}
