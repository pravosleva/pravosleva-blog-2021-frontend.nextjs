/* eslint-disable no-extra-boolean-cast */
import { useCallback, memo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import baseClasses from '~/App.module.scss'
// import { FaCopy, FaRegCopy } from 'react-icons/fa'
import clsx from 'clsx'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
  // SharedProps as ISharedProps,
  // closeSnackbar,
} from 'notistack'
import classes from './CopyToClipboardWrapper.module.scss'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FileCopyIcon from '@mui/icons-material/FileCopy'

type TProps = {
  text: string;
  onCopy?: () => void;
  showNotifOnCopy?: boolean;
}

export const CopyToClipboardWrapper = memo(({ onCopy, text, showNotifOnCopy }: TProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, opts)
  }, [enqueueSnackbar])
  // const showError = useCallback(({ message }: { message: string }) => {
  //   showNotif(message, { variant: 'default' })
  // }, [showNotif])
  // const showSuccess = useCallback(({ message }: { message: string }) => {
  //   showNotif(message, { variant: 'default' })
  // }, [showNotif])
  const showInfo = useCallback(({ message }: { message: string }) => {
    showNotif(message || 'No message', {
      variant: 'info',
      hideIconVariant: true,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      action: null,
    })
  }, [showNotif])
  const handleCopy = useCallback(() => {
    if (showNotifOnCopy) showInfo({ message: `Скопировано ${text}` })
    if (!!onCopy) onCopy()
    
    setIsCopied(true)
  }, [showNotifOnCopy, setIsCopied, onCopy, showInfo, text])

  return (
    <CopyToClipboard
      text={text}
      onCopy={handleCopy}
    >
      <span
        className={clsx([
          classes.wrapper,
          {
            [classes.danger]: !isCopied,
            [classes.success]: isCopied,
          },
        ])}
      >
        <code
          className={clsx([
            baseClasses.inlineCode,
            classes.targetText,
          ])}
        >{text}</code>
        {
          !isCopied ? (
            <span className={classes.copyIcon}>
              <ContentCopyIcon fontSize='small' />
            </span>
          ) : (
            // <span className={classes.copyInfo}>Скопировано</span>
            <span className={classes.copyIcon}>
              <FileCopyIcon fontSize='small' />
            </span>
          )
        }
      </span>
    </CopyToClipboard>
  )
})
