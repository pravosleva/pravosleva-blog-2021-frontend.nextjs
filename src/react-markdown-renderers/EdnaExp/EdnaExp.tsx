import React from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { theNotePageRenderers } from '~/react-markdown-renderers'
import { EdnaScriptService, TLoadingStatus } from './EdnaScriptService'
import { ednaEngine } from './ednaEngine'
import { useEdna } from './useEdna'
import { EdnaSpaceStatusSwitcher } from './components/EdnaSpaceStatusSwitcher'

interface IEdnaExpProps {
  scriptUrl: string;
  documentationMd: string;
  workerDelay?: number;
}

export const EdnaExp: React.FC<IEdnaExpProps> = ({ 
  scriptUrl, 
  documentationMd,
  workerDelay = 4000 
}) => {
  const logic = ednaEngine.inject(EdnaScriptService)
  
  // Получаем новые реактивные значения widgetBadge и widgetTheme
  const { 
    status, 
    error, 
    warning, 
    isWidgetApiReady, 
    isActionDisabled,
    widgetBadge,
    widgetTheme
  } = useEdna()

  const handleStartInitialization = () => {
    logic.loadScript(scriptUrl, workerDelay, 2000, 30000)
  }

  const getStatusColor = (currentStatus: TLoadingStatus) => {
    switch (currentStatus) {
      case 'success': return '#00b273'
      case 'failed': return '#d63435'
      case 'idle': return '#555'
      default: return '#ff8a53'
    }
  }

  return (
    <div 
      className="edna-exp-container"
      style={{
        marginBottom: '1.45rem',
        padding: '16px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <b>🧪 Тестовый стенд: Реактивный инжект виджетов</b>
      
      <div style={{ fontStyle: 'italic' }}>
        <ReactMarkdown plugins={[gfm]} renderers={theNotePageRenderers} children={documentationMd} />
      </div>

      {/* СЕТКА */}
      <div
        style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px',
        }}
      >
        {/* ЛЕВЫЙ БЛОК: РЕНДЕРИНГ КОСМИЧЕСКИХ СТАТУСОВ НА ОСНОВЕ СОСТОЯНИЯ АВТОМАТА */}
        <div style={{ /* padding: '24px 0', */ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <EdnaSpaceStatusSwitcher status={status} />
        </div>
        {/* ПРАВЫЙ БЛОК */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            width: '100%',
            position: 'relative',
          }}>
            <pre className='no-margin-bottom' style={{
              marginBottom: '0 !important',
              fontSize: 'small',
              fontWeight: 'bold',
              whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
              wordBreak: 'break-all', // По желанию: переносит слишком длинные слова
            }}>{JSON.stringify({ scriptUrl, 'window.ThreadsWidget.isReady': isWidgetApiReady, status, error }, null, 2)}</pre>
            <span
              style={{
                padding: '4px 10px', borderRadius: '16px', fontSize: 'small', fontWeight: 'bold',
                backgroundColor: getStatusColor(status), color: '#fff', textTransform: 'uppercase',
                position: 'absolute',
                top: '-8px',
                right: '-8px',
              }}>
              {status}
            </span>
          </div>
          {/* Кнопки жизненного цикла загрузки */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {
              isActionDisabled ? (
                <button
                  onClick={logic.reset}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '24px',
                    border: '1px solid #00b7ff',
                    backgroundColor: 'transparent',
                    color: '#00b7ff',
                    fontWeight: 'bold',
                    fontSize: '0.85em',
                    fontFamily: 'Montserrat, system-ui',

                    cursor: 'pointer',
                  }}
                >
                  Сбросить состояние
                </button>
              ) : (
                <button
                  onClick={handleStartInitialization}
                  disabled={isActionDisabled}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '24px',
                    border: 'none',
                    backgroundColor: '#00b7ff',
                    color: '#fff',
                    fontSize: '0.85em',
                    fontWeight: 'bold',
                    fontFamily: 'Montserrat, system-ui',
                    
                    cursor: isActionDisabled ? 'not-allowed' : 'pointer',
                    opacity: isActionDisabled ? 0.5 : 1, transition: 'background 0.2s',
                  }}
                >
                  Инициализировать подгрузку
                </button>
              )
            }
          </div>
          {
            (!!warning || !!error) && (
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontWeight: 'bold',
              }}>
                {warning && (
                  <div style={{
                    padding: '8px', backgroundColor: 'rgba(255,165,0,0.15)', borderLeft: '4px solid #ffa500', color: '#ffa500', fontSize: 'small', borderRadius: '8px' }}>
                    {warning}
                  </div>
                )}

                {error && (
                  <div style={{
                    padding: '8px', backgroundColor: 'rgba(214,52,53,0.15)', borderLeft: '4px solid #d63435', color: '#ff6b6b', fontSize: 'small', borderRadius: '8px' }}>
                    <strong>🚨 Ошибка:</strong> {error}
                  </div>
                )}
              </div>
            )
          }
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎮 ЖИВОЙ НЕОНОВЫЙ ПУЛЬТ УПРАВЛЕНИЯ API КОСМИЧЕСКОГО ВИДЖЕТА */}
      {/* ========================================================================= */}
      <div 
        className="edna-api-dashboard"
        style={{ 
          // paddingTop: '24px',
          // borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Шапка пульта с динамическим индикатором питания системы */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            letterSpacing: '0.5px',
            // color: isWidgetApiReady ? '#00b7ff' : 'rgba(255,255,255,0.4)',
            opacity: isWidgetApiReady ? 1 : 0.4,
            transition: 'color 0.3s ease'
          }}
        >
          <span>{isWidgetApiReady ? '⚡' : '💤'}</span>
          <span>ЦЕНТРАЛЬНЫЙ ПУЛЬТ УПРАВЛЕНИЯ API ВИДЖЕТА</span>
          
          {/* Пульсирующий диод статуса питания пульта */}
          <span 
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isWidgetApiReady ? '#00b273' : '#555',
              boxShadow: isWidgetApiReady ? '0 0 10px #00b273, 0 0 4px #00b273' : 'none',
              marginLeft: 'auto',
              display: 'inline-block',
              animation: isWidgetApiReady ? 'html-led-glow 1s ease-in-out infinite' : 'none'
            }}
          />
        </div>
        
        {/* ИНТЕРАКТИВНЫЕ КАРТОЧКИ-ИНДИКАТОРЫ СОСТОЯНИЯ WINDOW РАНТАЙМА */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            opacity: isWidgetApiReady ? 1 : 0.35,
            filter: isWidgetApiReady ? 'blur(0px)' : 'blur(1px)',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Индикатор Счетчик (Badge) */}
          <div 
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: isWidgetApiReady ? 'rgba(0, 183, 255, 0.06)' : 'rgba(255,255,255,0.02)',
              border: isWidgetApiReady ? '1px solid rgba(0, 183, 255, 0.25)' : '1px solid rgba(255,255,255,0.05)',
              boxShadow: isWidgetApiReady ? 'inset 0 0 12px rgba(0, 183, 255, 0.05)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Montserrat' }}>
              Счетчик уведомлений
            </span>
            <code style={{ width: 'fit-content', fontSize: '1.1rem', fontWeight: 'bold', color: isWidgetApiReady ? '#fff' : 'inherit', fontFamily: 'monospace' }}>
              {isWidgetApiReady ? widgetBadge : 'OFFLINE'}
            </code>
          </div>

          {/* Индикатор Тема (Theme) */}
          <div 
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: isWidgetApiReady ? (widgetTheme === 'dark' ? 'rgba(255, 142, 83, 0.06)' : 'rgba(0, 178, 115, 0.06)') : 'rgba(255,255,255,0.02)',
              border: isWidgetApiReady ? (widgetTheme === 'dark' ? '1px solid rgba(255, 142, 83, 0.25)' : '1px solid rgba(0, 178, 115, 0.25)') : '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Montserrat' }}>
              Активный режим скина
            </span>
            <code style={{ width: 'fit-content', fontSize: '1.1rem', fontWeight: 'bold', color: isWidgetApiReady ? '#fff' : 'inherit', fontFamily: 'monospace' }}>
              {isWidgetApiReady ? widgetTheme.toUpperCase() : 'DISCONNECTED'}
            </code>
          </div>
        </div>

        {/* СОРЕВНОВАТЕЛЬНЫЕ ТЕХНОЛОГИЧЕСКИЕ КНОПКИ ДЕЙСТВИЯ ПУЛЬТА */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            opacity: isWidgetApiReady ? 1 : 0.4,
            transition: 'opacity 0.3s ease'
          }}
        >
          {/* Кнопка 1: Инкремент баджа уведомлений */}
          <button
            onClick={logic.callWidgetIncrement}
            disabled={!isWidgetApiReady}
            style={{
              padding: '6px 14px',
              borderRadius: '24px',
              border: 'none',
              // backgroundColor: '#00b7ff',
              color: '#fff',
              fontSize: '0.85em',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, system-ui',

              // border: 'none',
              backgroundColor: isWidgetApiReady ? '#00b7ff' : '#444',
              // color: '#fff',
              // fontSize: '0.85em',
              // fontWeight: 'bold',
              cursor: isWidgetApiReady ? 'pointer' : 'not-allowed',
              // fontFamily: 'Montserrat, system-ui',
              boxShadow: isWidgetApiReady ? '0 4px 14px rgba(0, 183, 255, 0.3)' : 'none',
              transform: 'translateY(0px)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseOver={(e) => isWidgetApiReady && (e.currentTarget.style.backgroundColor = '#00a3e0')}
            onMouseOut={(e) => isWidgetApiReady && (e.currentTarget.style.backgroundColor = '#00b7ff')}
          >
            🚀 Отправить инкремент (API)
          </button>

          {/* Кнопка 2: Переключатель инверсии тем виджета */}
          <button
            onClick={logic.callWidgetToggleTheme}
            disabled={!isWidgetApiReady}
            style={{
              padding: '6px 14px',
              borderRadius: '24px',
              // border: 'none',
              // backgroundColor: '#00b7ff',
              // color: '#fff',
              fontSize: '0.85em',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, system-ui',
              
              // padding: '10px 18px',
              // borderRadius: '14px',
              border: isWidgetApiReady ? '1px solid #00b7ff' : '1px solid #555',
              backgroundColor: 'transparent',
              color: isWidgetApiReady ? '#00b7ff' : '#666',
              // fontSize: '0.85em',
              // fontWeight: 'bold',
              cursor: isWidgetApiReady ? 'pointer' : 'not-allowed',
              // fontFamily: 'Montserrat, system-ui',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseOver={(e) => isWidgetApiReady && (e.currentTarget.style.backgroundColor = 'rgba(0, 183, 255, 0.08)')}
            onMouseOut={(e) => isWidgetApiReady && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            🌗 Инвертировать скин
          </button>
        </div>
      </div>

    </div>
  )
}
