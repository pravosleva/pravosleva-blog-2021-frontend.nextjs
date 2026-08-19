import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { theNotePageRenderers } from '~/react-markdown-renderers'
import classes from './CollapsibleBox.module.scss'
import { isValidJson } from '~/utils/isValidJson'
import { withTranslator } from '~/hocs/withTranslator'
import clsx from 'clsx'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'
import { collapsibleRegistrySignal } from '~/store/reactive-engine/reactiveCollapsibleStore'
import { generateSlugId } from '~/store/reactive-engine/utils'

type TProps = {
  header: string;
  text?: string;
  actionsJson?: string;
  t: (v: string) => string;
  isEnabledForNavigation?: '1' | '0';
}

const standardDesktopOffsetTop = 50 + 16

export const CollapsibleBox = withTranslator<any>(({
  header,
  text,
  actionsJson,
  t,
  isEnabledForNavigation = '0', // Дефолтное значение '0' (игнорируется)
}: TProps) => {
  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: 2, // NOTE: Все что больше 2px по высоте будет проскроллено в топ страницы
  }))
  const rootRef = useRef<HTMLDivElement>(null)
  // Генерируем ID только если навигация включена, иначе ID на теге не обязателен
  const boxId = useMemo(() => {
    return isEnabledForNavigation === '1' ? generateSlugId(header) : undefined
  }, [header, isEnabledForNavigation])
  // Отслеживание видимости через IntersectionObserver и реактивный движок
  // Отслеживание видимости и регистрация в реактивном движке
  useEffect(() => {
    // Если навигация для этого блока выключена, ничего не делаем
    if (isEnabledForNavigation !== '1' || !boxId) return

    const element = rootRef.current
    if (!element) return

    // Добавляем текущий блок в сигнал реестра
    collapsibleRegistrySignal.value = {
      ...collapsibleRegistrySignal.value,
      [boxId]: { id: boxId, header, isVisible: false }
    }

    const observer = new IntersectionObserver(([entry]) => {
      // Обновляем статус видимости в сигнале напрямую
      if (collapsibleRegistrySignal.value[boxId]) {
        collapsibleRegistrySignal.value = {
          ...collapsibleRegistrySignal.value,
          [boxId]: { ...collapsibleRegistrySignal.value[boxId], isVisible: entry.isIntersecting }
        }
      }
    }, {
      rootMargin: '-10% 0px -10% 0px'
    })

    observer.observe(element)

    // При размонтировании удаляем только этот блок из реестра
    return () => {
      observer.disconnect()
      const currentRegistry = { ...collapsibleRegistrySignal.value }
      if (currentRegistry[boxId]) {
        delete currentRegistry[boxId]
        collapsibleRegistrySignal.value = currentRegistry
      }
    }
  }, [boxId, header, isEnabledForNavigation])
  const isActionsRequired = useMemo(() => typeof actionsJson === 'string', [actionsJson])
  const isActionsValid = useMemo(() => !!actionsJson && isActionsRequired && isValidJson(actionsJson), [isActionsRequired, actionsJson])
  const parsedActions = useMemo(() => (!!actionsJson && isActionsRequired && isActionsValid)
    ? JSON.parse(actionsJson)
    : null, [actionsJson, isActionsRequired, isActionsValid])
  const [isOpened, setIsOpened] = useState(false)
  const handleToggle = useCallback(() => {
    setIsOpened((s) => !s)
  }, [setIsOpened])
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const bgColor = useMemo(() => {
    switch (currentTheme) {
      case 'light':
        return '#ededed'
      case 'gray':
        return '#ededed'
      case 'hard-gray':
        return 'gray'
      case 'dark':
        return 'rgba(255, 255, 255, 0.25)'
      default:
        return '#fff'
    }
  }, [currentTheme])
  const textColor = useMemo(() => {
    switch (currentTheme) {
      case 'light':
        return '#000'
      case 'gray':
        return 'inherit'
      case 'hard-gray':
        return '#fff'
      case 'dark':
        return 'inherit'
      default:
        return '#000'
    }
  }, [currentTheme])

  const handleClickLink = useCallback(({ link, label }: { link: string; label: string }) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
    const hasLocalLinkClicked = (label === 'LOCAL_LINK' && typeof link === 'string' && link[0] === '#') || false

    switch (true) {
      case hasLocalLinkClicked: {
        e.preventDefault()
        try {
          const elmId = link.substring(1)
          scrollToIdRef.current({ id: elmId })
        } catch (err: any) {
          console.log(err?.message || 'No err.message')
        }
        break
      }
      default:
        break
    }
  }, [])
  // const togglerSlug = slugify(header).toLowerCase() 

  return (
    <div
      ref={rootRef}
      id={boxId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '2px solid inherit',
        padding: '16px',
        transition: '0.2s all ease',
        borderRadius: isOpened ? '20px' : '28px',
        color: textColor,
        backgroundColor: bgColor,
        boxShadow: '0 8px 6px -6px rgba(0,0,0,0.3)',
        marginBottom: '20px',
        whiteSpace: 'pre-wrap',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={handleToggle}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: '16px',
        }}
        className={classes.collapsible}
      >
        <div style={{ fontWeight: 'bold' }}>{header}</div>
        <div
          style={{
            marginLeft: 'auto',
            border: '2px solid inherit',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            paddingTop: '4px',
          }}
        >
          {
            isOpened
              ? <KeyboardArrowUpIcon fontSize='small' />
              : <KeyboardArrowDownIcon fontSize='small' />
          }
        </div>
      </div>

      {!!text && isOpened && (
        <div
          className={clsx(classes.noMarginBottomForLastChild, classes.content)}
        >
          <ReactMarkdown
            // @ts-ignore
            plugins={[gfm, { singleTilde: false }]}
            renderers={theNotePageRenderers}
            children={text}
          />
        </div>
      )}

      {
        isOpened && !!parsedActions && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {
              parsedActions.map(({ link, label, _label, target }: { link: 'string'; _label?: 'string'; label: 'string'; target?: '_blank' | '_self' }, i: number) => {
                return (
                  <a
                    key={`${link}-${i}`}
                    className={clsx('link-as-rippled-btn', 'truncate')}
                    href={link}
                    onClick={handleClickLink({ link, label })}
                    style={{
                      color: '#fff',
                      borderRadius: '8px',
                    }}
                    target={target || '_self'}
                  >
                    {_label || t(label)}
                  </a>
                )
              })
            }
          </div>
        )
      }
      {
        isOpened && isActionsRequired && !isActionsValid && (
          <>
            <pre style={{ marginBottom: '0px !important' }}>{JSON.stringify({
              isActionsRequired,
              isActionsValid,
            }, null, 2)}</pre>
            <div>Incorrect props</div>
          </>
        )
      }
    </div>
  )
})
