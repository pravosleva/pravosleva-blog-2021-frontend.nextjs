import { useBaseStyles } from '~/mui/useBaseStyles'
import clsx from 'clsx'
// import classes from './ResponsiveBlock.module.scss'
import { useStyles } from './useStyles'
// import { Container } from '@mui/material'
import { Container } from './components'
import classes from './ResponsiveBlock.module.scss'

type TProps = {
  isLimited?: boolean;
  isPaddedMobile?: boolean;
  style?: React.CSSProperties;
  className?: any;
  hasDesktopFrame?: boolean;
  children: React.ReactNode;
  zeroPaddingMobile?: boolean;
  isLimitedForDesktop?: boolean;
  isLastSection?: boolean;
}

export const ResponsiveBlock = ({
  zeroPaddingMobile,
  children,
  isLimited,
  isPaddedMobile,
  style,
  className,
  hasDesktopFrame,
  isLimitedForDesktop,
  isLastSection
}: TProps) => {
  const baseStyles = useBaseStyles()
  const styles = useStyles()

  switch (true) {
    case isLimitedForDesktop:
      return (
        <div
          className={clsx(
            // { [classes.isLastSection]: isLastSection },
            classes.limitedWidth,
            classes.centered,
          )}
          // style={{ border: '1px dashed red' }}
        >
          <Container
            style={style}
            maxWidth='md'
            isPaddedMobile={isPaddedMobile}
            isLastSection={isLastSection}
            className={clsx(
              styles.responsiveBlock,
              classes.centered,
              className,
              { [classes.isLimitedForDesktop]: isLimitedForDesktop },
            )}>{children}</Container>
        </div>
      )
    case isLimited && !isPaddedMobile && !hasDesktopFrame:
    case isLimited && !isPaddedMobile:
      return (
        <div
          className={clsx(
            // { [classes.isLastSection]: isLastSection },
            classes.limitedWidth,
            classes.centered,
          )}
          // className={clsx({ [classes.isLastSection]: isLastSection })}
          // style={{ border: '1px dashed red' }}
        >
          <Container
            style={style}
            maxWidth='md'
            isPaddedMobile={isPaddedMobile}
            isLastSection={isLastSection}
            className={clsx(
              styles.responsiveBlock,
              classes.centered,
              className,
              { 'zero-pad-mob': zeroPaddingMobile, [classes.isLimited]: isLimited }
            )}>{children}</Container>
        </div>
      )
    case isLimited && hasDesktopFrame:
      return (
        <div
          className={
            clsx(
              // { [classes.isLastSection]: isLastSection },
              classes.limitedWidth,
              classes.centered,
            )
          }
          // style={{ border: '1px dashed black' }}
        >
          <Container
            style={style}
            maxWidth='md'
            isPaddedMobile={isPaddedMobile}
            isLastSection={isLastSection}
            className={clsx(
              styles.responsiveBlock,
              classes.centered,
              baseStyles.noPaddedMobile,
              className,
              { 'zero-pad-mob': zeroPaddingMobile, [classes.isLimited]: isLimited }
            )}>{children}</Container>
        </div>
      )
    default:
      return (
        <div
          style={{
            ...style,
            // border: '1px dashed black',
          }}
          className={
            clsx(
              // { [classes.isLastSection]: isLastSection },
              classes.centered,
            )
          }
        >
          <Container
            maxWidth='md'
            isPaddedMobile={isPaddedMobile}
            isLastSection={isLastSection}
            className={
              clsx(
                styles.responsiveBlock,
                classes.centered,
                className,
                {
                  [classes.isPaddedMobile]: isPaddedMobile,
                  'zero-pad-mob': zeroPaddingMobile,
                  [classes.isLastSection]: isLastSection
                },
              )
            }
          >
          {children}</Container>
        </div>
      )
  }
}
