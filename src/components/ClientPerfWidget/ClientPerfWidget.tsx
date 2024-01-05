import { useState, useRef, useLayoutEffect, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import classes from './ClientPerfWidget.module.scss'
import { linear } from 'math-interpolate'
import { ProgressBar } from './ProgressBar'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useSelector, useDispatch } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { toggleBrowserMemoryMonitor } from '~/store/reducers/customDevTools'

type TProps = {
  position: 'top-center';
}

const getPercentage = ({ x, sum }: { x: number, sum: number }) => {
  const result = linear({
    x1: 0,
    y1: 0,
    x2: sum,
    y2: 100,
    x: x,
  })
  return result
}

type TMainStackItem = {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}
const mainStackLimit = 50
// const getMB = (b: number): number => b / (1024 * 1024)
// const getGB = (b: number): number => b / (1024 * 1024 * 1024)
const canvasCfg = {
  width: 200,
  height: 15,
}
const interval = 1 * 1000

const getOffsetY = ({ data, fullPx, targetField }: {
  data: TMainStackItem;
  fullPx: number;
  targetField: string;
}) => {
  const { jsHeapSizeLimit: limit, totalJSHeapSize: total, usedJSHeapSize: used } = data
  let hPx = 0
  switch (targetField) {
    case 'total':
      hPx = (fullPx * total) / limit
      break
    case 'used':
      hPx = (fullPx * used) / total
      break
    default:
      break
  }
  return { strartY: fullPx - hPx, hPx }
}
const getStepX = ({ fullWidthPx, totalStackItems }: {
  fullWidthPx: number;
  totalStackItems: number;
}) => fullWidthPx / (totalStackItems * 2 < 100 ? 100 : totalStackItems * 2)

export const ClientPerfWidget = (ps: TProps) => {
  const dispatch = useDispatch()
  const reduxState = useSelector((state: IRootState) => state)
  const isBrowserMemoryMonitorEnabled = useSelector((state: IRootState) => state.customDevTools.browserMemoryMonitor.isEnabled)
  // const [isWidgetOpened, setIsWidgetOpened] = useState(false)
  const handleOpenToggle = useCallback(() => {
    // setIsWidgetOpened((s) => !s)
    dispatch(toggleBrowserMemoryMonitor())
  }, [dispatch, reduxState])

  const [state, setMemState] = useState<any>(null)
  const [counter, setCounter] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout>()
  const mainStackRef = useRef<TMainStackItem[]>([])

  useLayoutEffect(() => {
    // @ts-ignore
    if (!window.performance?.memory) return

    intervalRef.current = setInterval(() => {
      setCounter((s) => s + 1)
    }, interval)

    return () => {
      if (!!intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    // @ts-ignore
    // if (!window.performance?.memory) return
    const memState = window.performance?.memory
    const isCorrect = !!memState?.jsHeapSizeLimit && !!memState?.totalJSHeapSize && !!memState?.usedJSHeapSize

    if (isCorrect) setMemState({
      jsHeapSizeLimit: memState.jsHeapSizeLimit,
      totalJSHeapSize: memState.totalJSHeapSize,
      usedJSHeapSize: memState.usedJSHeapSize
    })
    if (isCorrect) {
      if (mainStackRef.current.length < mainStackLimit) mainStackRef.current.push(memState)
      else {
        mainStackRef.current.shift()
        mainStackRef.current.push(memState)
      }
      if (!!canvasRef.current) {
        const cfg = canvasCfg
        const ctx = canvasRef.current.getContext('2d')
        let x = 0
        const stepX = getStepX({ fullWidthPx: cfg.width, totalStackItems: mainStackRef.current.length })
        if (!!ctx) setTimeout(() => {
          // @ts-ignore
          ctx.reset()
          mainStackRef.current.forEach((data) => {
            const c1 = getOffsetY({ data, fullPx: cfg.height, targetField: 'total' })
            // NOTE: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
            ctx.rect(x, c1.strartY, stepX, c1.hPx)
            ctx.fill()
            x += stepX

            const c2 = getOffsetY({ data, fullPx: cfg.height, targetField: 'used' })
            ctx.rect(x, c2.strartY, stepX, c2.hPx)
            ctx.fill()
            x += stepX
          })
        }, 0)
      }
    }
  }, [counter])

  const limit = useMemo(() => (state?.jsHeapSizeLimit || 0) / 1024 / 1024, [state?.jsHeapSizeLimit])
  const total = useMemo(() => (state?.totalJSHeapSize || 0) / 1024 / 1024, [state?.totalJSHeapSize])
  const used = useMemo(() => (state?.usedJSHeapSize || 0) / 1024 / 1024, [state?.usedJSHeapSize])
  const totalOfLimit = useMemo(() => getPercentage({ x: total, sum: limit }), [total, limit])
  const usedOfTotal = useMemo(() => getPercentage({ x: used, sum: total }), [used, total])

  return (
    <div
      className={clsx(
        classes.wrapper,
        classes.stack1,
        classes.fixedBox,
        {
          // [classes.bottomCenter]: ps.position === 'bottom-center',
          [classes.topCenter]: ps.position === 'top-center',
          [classes.isClosed]: !isBrowserMemoryMonitorEnabled,
          [classes.isOpened]: isBrowserMemoryMonitorEnabled,
        },
        'backdrop-blur--lite',
      )}
    >
      {
        !!state ? (
          <>
            <canvas ref={canvasRef} className={classes.canvas} height={canvasCfg.height} width={canvasCfg.width} />
            <div className={classes.stack0}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span><b>Used</b> of Total</span>
                <span>{total.toFixed(0)} MB</span>
              </div>
              <ProgressBar value={usedOfTotal} label={`${used.toFixed(0)} MB`} />
            </div>
            
            <div className={classes.stack0}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span><b>Total</b> of Limit</span>
                <span>{limit.toFixed(0)} MB</span>
              </div>
              <ProgressBar value={totalOfLimit} label={`${total.toFixed(0)} MB`} />
            </div>
          </>
        ) : (
          <div style={{ fontWeight: 'bold', padding: '0px 8px' }}>Memory stat isnt supported</div>
        )
      }
      {
        isBrowserMemoryMonitorEnabled && (
          <button
            className={clsx(classes.absoluteToggler, 'backdrop-blur--lite')}
            onClick={handleOpenToggle}
          >
            {/* <span>⚙️</span>
            <span>Memory</span> */}
            {/*
              isBrowserMemoryMonitorEnabled ? <ExpandLessIcon style={{ fontSize: '16px' }} /> : <ExpandMoreIcon style={{ fontSize: '16px' }} />
            */}
            <ExpandLessIcon style={{ fontSize: '16px' }} />
          </button>
        )
      }
    </div>
  )
}
