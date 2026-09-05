import React, { memo } from 'react'
import { useBaseStyles } from '~/mui/useBaseStyles'
import clsx from 'clsx'
import { useStyles } from './useStyles'
import { Container } from './components'
import classes from './ResponsiveBlock.module.scss'

type TProps = {
  isLimited?: boolean;
  isPaddedMobile?: boolean;
  style?: React.CSSProperties;
  className?: string; // Оптимизация 1: Заменяем any на строковый тип
  hasDesktopFrame?: boolean;
  children: React.ReactNode;
  zeroPaddingMobile?: boolean;
  isLimitedForDesktop?: boolean;
}

export const ResponsiveBlock = memo(({
  zeroPaddingMobile,
  children,
  isLimited,
  isPaddedMobile,
  style,
  className,
  hasDesktopFrame,
  isLimitedForDesktop,
}: TProps) => {
  const baseStyles = useBaseStyles()
  const styles = useStyles()

  // Оптимизация 2: Собираем классы внешнего div в одном месте на основе флагов.
  // Это заменяет весь громоздкий switch (true)
  const isWrapperLimited = isLimitedForDesktop || isLimited

  const wrapperClassName = clsx(
    classes.centered,
    { [classes.limitedWidth]: isWrapperLimited }
  )

  // Оптимизация 3: Собираем классы для внутреннего Container
  const containerClassName = clsx(
    styles.responsiveBlock,
    classes.centered,
    className,
    {
      [classes.isLimitedForDesktop]: isLimitedForDesktop,
      [classes.isLimited]: isLimited,
      [classes.isPaddedMobile]: isPaddedMobile,
      [baseStyles.noPaddedMobile]: isLimited && hasDesktopFrame,
      'zero-pad-mob': zeroPaddingMobile,
    }
  )

  // Оптимизация 4: Защищаем инлайновые стили от создания лишних ссылок в памяти
  return (
    <div className={wrapperClassName} style={style}>
      <Container
        maxWidth="md"
        isPaddedMobile={isPaddedMobile}
        className={containerClassName}
      >
        {children}
      </Container>
    </div>
  )
})

ResponsiveBlock.displayName = 'ResponsiveBlock'
