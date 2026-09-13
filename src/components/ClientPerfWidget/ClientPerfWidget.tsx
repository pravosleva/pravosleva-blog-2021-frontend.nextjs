import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import classes from './ClientPerfWidget.module.scss'
import { linear } from 'math-interpolate'
import { ProgressBar } from './ProgressBar'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useSelector, useDispatch } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { toggleBrowserMemoryMonitor } from '~/store/reducers/customDevTools'
import { getHumanizedReadableSize } from '~/utils/getHumanizedReadableSize'

// Импортируем примитивы вашего реактивного фреймворка
import { AbstractService, ReactiveEngine } from '@pravosleva/reactive-engine'
import { useSignalValue } from '~/utils/reactive-engine'

type TProps = {
  position: 'top-center';
}

type TMainStackItem = {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

const mainStackLimit = 1000
const canvasCfg = { width: 200, height: 15 }
const UPDATE_INTERVAL_MS = 100 // Шаг обновления данных

const getPercentage = (x: number, sum: number) => {
  if (!sum) return 0
  return linear({ x1: 0, y1: 0, x2: sum, y2: 100, x })
}

const getOffsetY = (data: TMainStackItem, fullPx: number, targetField: 'total' | 'used') => {
  const { jsHeapSizeLimit: limit, totalJSHeapSize: total, usedJSHeapSize: used } = data
  let hPx = 0
  switch (targetField) {
    case 'total':
      hPx = (fullPx * total) / limit
      break
    case 'used':
      hPx = (fullPx * used) / total
      break
  }
  return { startY: fullPx - hPx, hPx }
}

// 1. ИЗОЛИРОВАННАЯ РЕАКТИВНАЯ СЛУЖБА УПРАВЛЕНИЯ ПАМЯТЬЮ
class MemoryMonitorService extends AbstractService {
  // Атомарный сигнал хранения плоских человекочитаемых данных
  public metrics = this.engine.signal<{
    limitLabel: string;
    totalLabel: string;
    usedLabel: string;
    usedOfTotalPercent: number;
    totalOfLimitPercent: number;
  }>({
    limitLabel: '0 MB',
    totalLabel: '0 MB',
    usedLabel: '0 MB',
    usedOfTotalPercent: 0,
    totalOfLimitPercent: 0
  }, 'perf-widget:signal:metrics')
}

const perfEngine = new ReactiveEngine({
  logger: {
    isEnabled: process.env.NODE_ENV === 'development',
    filter: /^perf-widget-*/
  }
})

export const ClientPerfWidget = (ps: TProps) => {
  const dispatch = useDispatch()
  const isBrowserMemoryMonitorEnabled = useSelector((state: IRootState) => state.customDevTools.browserMemoryMonitor.isEnabled)
  
  // Внедряем службу логики и подписываем React только на конечные текстовые метрики
  const logic = perfEngine.inject(MemoryMonitorService)
  const currentMetrics = useSignalValue(logic.metrics)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mainStackRef = useRef<TMainStackItem[]>([])
  const requestRef = useRef<number>(0)
  const lastUpdateRef = useRef<number>(0)

  const handleOpenToggle = () => {
    dispatch(toggleBrowserMemoryMonitor())
  }

  // ИГРОВОЙ ЦИКЛ ОБНОВЛЕНИЯ МЕТРИК И ОТРИСОВКИ CANVAS (Вне React-шедулера)
  useEffect(() => {
    // @ts-ignore
    const memEngine = window.performance?.memory
    if (!memEngine) return

    const loop = (timestamp: number) => {
      // Квантование времени: выполняем расчет строго раз в 100 мс
      if (timestamp - lastUpdateRef.current >= UPDATE_INTERVAL_MS) {
        lastUpdateRef.current = timestamp

        const limit = memEngine.jsHeapSizeLimit
        const total = memEngine.totalJSHeapSize
        const used = memEngine.usedJSHeapSize

        // 1. Идемпотентно пушим данные в цикличный стек истории
        const currentStack = mainStackRef.current
        if (currentStack.length >= mainStackLimit) {
          currentStack.shift()
        }
        currentStack.push({ jsHeapSizeLimit: limit, totalJSHeapSize: total, usedJSHeapSize: used })

        // 2. Атомарно обновляем текстовые сигналы для прогрессбаров
        logic.metrics.value = {
          limitLabel: getHumanizedReadableSize({ bytes: limit, decimals: 1 }),
          totalLabel: getHumanizedReadableSize({ bytes: total, decimals: 1 }),
          usedLabel: getHumanizedReadableSize({ bytes: used, decimals: 1 }),
          usedOfTotalPercent: getPercentage(used, total),
          totalOfLimitPercent: getPercentage(total, limit)
        }

        // 3. Прямая синхронная отрисовка Canvas без setTimeout и просадок FPS
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // Быстрый сброс контекста без утечек памяти
            ctx.clearRect(0, 0, canvasCfg.width, canvasCfg.height)
            ctx.beginPath()

            const totalItems = currentStack.length
            const stepX = canvasCfg.width / (totalItems * 2 < 100 ? 100 : totalItems * 2)
            let x = 0

            // Высокопроизводительный In-place цикл рендеринга пикселей графиков
            for (let i = 0; i < totalItems; i++) {
              const data = currentStack[i]

              // Отрезок Used
              const c1 = getOffsetY(data, canvasCfg.height, 'used')
              ctx.rect(x, c1.startY, stepX, c1.hPx)
              x += stepX

              // Отрезок Total
              const c2 = getOffsetY(data, canvasCfg.height, 'total')
              ctx.rect(x, c2.startY, stepX, c2.hPx)
              x += stepX
            }
            ctx.fillStyle = currentMetrics.usedOfTotalPercent > 85 ? '#ff4d4d' : 'rgba(57, 229, 172, 0.4)'
            ctx.fill()
          }
        }
      }

      // Рекурсивно запрашиваем следующий кадр у видеокарты устройства
      requestRef.current = requestAnimationFrame(loop)
    }

    // Запускаем игровой цикл трекинга
    requestRef.current = requestAnimationFrame(loop)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [isBrowserMemoryMonitorEnabled, currentMetrics.usedOfTotalPercent])

  // @ts-ignore
  const isSupported = typeof window !== 'undefined' && !!window.performance?.memory

  // Вставьте этот метод внутрь компонента ClientPerfWidget для проверки:
  // const triggerMemoryLeakTest = () => {
  //   console.log('🔥 [Stress Test]: Начинаем спамить в кучу (Heap)...');
    
  //   // Создаем глобальный массив-утечку, который сборщик мусора не сможет удалить
  //   (window as any).__leakData = (window as any).__leakData || [];
    
  //   // Каждые 50 мс забиваем память огромными строками
  //   const leakInterval = setInterval(() => {
  //     for (let i = 0; i < 5000; i++) {
  //       (window as any).__leakData.push(new Array(1000).join('X-OXYGEN-MEM-SPAM-'));
  //     }
  //   }, 50);

  //   // Останавливаем утечку через 3 секунды, чтобы не обрушить вкладку смартфона
  //   setTimeout(() => {
  //     clearInterval(leakInterval);
  //     console.log('🛑 [Stress Test]: Спам завершен. Ждем ленивого тика мобильного Хрома...');
  //   }, 3000);
  // }

  if (!isSupported) {
    return <div className={classes.wrapper} style={{ fontWeight: 'bold', padding: '0px 8px' }}>Memory stat isnt supported</div>
  }

  return (
    <div
      className={clsx(
        classes.wrapper,
        classes.stack1,
        classes.fixedBox,
        {
          [classes.topCenter]: ps.position === 'top-center',
          [classes.isClosed]: !isBrowserMemoryMonitorEnabled,
          [classes.isOpened]: isBrowserMemoryMonitorEnabled,
        },
        'backdrop-blur--lite',
      )}
    >
      <canvas ref={canvasRef} className={classes.canvas} height={canvasCfg.height} width={canvasCfg.width} />
      
      <div className={classes.stack0}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><b>Used</b> of Total</span>
          <span>{currentMetrics.totalLabel}</span>
        </div>
        <ProgressBar value={currentMetrics.usedOfTotalPercent} label={currentMetrics.usedLabel} />
      </div>

      <div className={classes.stack0}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span><b>Total</b> of Limit</span>
          <span>{currentMetrics.limitLabel}</span>
        </div>
        <ProgressBar value={currentMetrics.totalOfLimitPercent} label={currentMetrics.totalLabel} />
      </div>

      {isBrowserMemoryMonitorEnabled && (
        <button className={classes.absoluteToggler} onClick={handleOpenToggle}>
          <ExpandLessIcon style={{ fontSize: '16px' }} />
        </button>
      )}
    </div>
  )
}
