import React from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { theNotePageRenderers } from '~/react-markdown-renderers'

import { EdnaScriptService, TLoadingStatus } from './EdnaScriptService'
import { ednaEngine } from './ednaEngine'
import { useEdna } from './useEdna'

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
        // backgroundColor: '#1e1e24',
        // border: '1px solid rgba(255,255,255,0.1)',
        // color: '#fff',
        // fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <h3>🧪 Тестовый стенд: Реактивный инжект виджетов</h3>
      
      <div>
        <ReactMarkdown plugins={[gfm]} renderers={theNotePageRenderers} children={documentationMd} />
      </div>
      
      <div><strong>Абсолютный URL скрипта:</strong> <code>{scriptUrl}</code></div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <strong>Текущий статус:</strong>
        <span style={{ padding: '4px 10px', borderRadius: '16px', fontSize: 'small', fontWeight: 'bold', backgroundColor: getStatusColor(status), color: '#fff', textTransform: 'uppercase' }}>
          {status}
        </span>
      </div>

      {warning && (
        <div style={{ padding: '8px', backgroundColor: 'rgba(255,165,0,0.15)', borderLeft: '4px solid #ffa500', color: '#ffa500', fontSize: '13px', borderRadius: '4px' }}>
          {warning}
        </div>
      )}

      {error && (
        <div style={{ padding: '8px', backgroundColor: 'rgba(214,52,53,0.15)', borderLeft: '4px solid #d63435', color: '#ff6b6b', fontSize: '13px', borderRadius: '4px' }}>
          <strong>🚨 Ошибка:</strong> {error}
        </div>
      )}

      <div>
        <strong>Статус <code>window.ThreadsWidget.isReady</code> 👉 </strong>{' '}
        {isWidgetApiReady ? (
          <span style={{ color: '#00b273', fontWeight: 'bold' }}>Готов к работе (isReady: true) ✅</span>
        ) : status === 'polling-api' ? (
          <span style={{ color: '#ff8a53' }}>Поллинг переменной (интервал 2с...) 🔄</span>
        ) : (
          <span style={{ opacity: 0.5 }}>Спит / Ожидает загрузки 😴</span>
        )}
      </div>

      {/* Кнопки жизненного цикла загрузки */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {
          isActionDisabled ? (
            <button
              onClick={logic.reset}
              style={{
                padding: '6px 14px', borderRadius: '24px',
                border: '1px solid #00b7ff',
                backgroundColor: 'transparent',
                color: '#00b7ff',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.85em',
                fontFamily: 'Montserrat, system-ui',
              }}
            >
              Сбросить состояние
            </button>
          ) : (
            <button
              onClick={handleStartInitialization}
              disabled={isActionDisabled}
              style={{ padding: '6px 14px', borderRadius: '24px', border: 'none', backgroundColor: '#ff8a53',
                color: '#fff', fontSize: '0.85em', fontWeight: 'bold', cursor: isActionDisabled ? 'not-allowed' : 'pointer', opacity: isActionDisabled ? 0.5 : 1, transition: 'background 0.2s',
                fontFamily: 'Montserrat, system-ui',
              }}
            >
              Инициализировать подгрузку
            </button>
          )
        }
      </div>

      <div 
        style={{ 
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ opacity: isWidgetApiReady ? 1 : 0.4 }}>🎮 Пульт управления API виджета (из React в window):</div>
        
        {/* Отображение прочитанного из window состояния */}
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', gap: '8px', fontSize: 'small', opacity: isWidgetApiReady ? 1 : 0.4 }}>
          <div>Текущий счетчик в виджете: <code>{widgetBadge}</code></div>
          <div>Текущая тема виджета: <code>{widgetTheme.toUpperCase()}</code></div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={logic.callWidgetIncrement}
            disabled={!isWidgetApiReady}
            style={{
              padding: '6px 14px',
              borderRadius: '24px',
              border: 'none',
              backgroundColor: '#00b7ff',
              color: '#fff',
              fontSize: '0.85em',
              fontWeight: 'bold',
              cursor: isWidgetApiReady ? 'pointer' : 'not-allowed',
              opacity: isWidgetApiReady ? 1 : 0.4,
              fontFamily: 'Montserrat, system-ui',
            }}
          >
            ➕ Добавить уведомление (API)
          </button>

          <button
            onClick={logic.callWidgetToggleTheme}
            disabled={!isWidgetApiReady}
            style={{
              padding: '6px 14px',
              borderRadius: '24px',
              border: '1px solid #00b7ff',
              backgroundColor: 'transparent',
              color: '#00b7ff',
              fontSize: '0.85em',
              fontWeight: 'bold',
              cursor: isWidgetApiReady ? 'pointer' : 'not-allowed',
              opacity: isWidgetApiReady ? 1 : 0.4,
              fontFamily: 'Montserrat, system-ui',
            }}
          >
            🌗 Переключить тему виджета (API)
          </button>
        </div>
      </div>

    </div>
  )
}
