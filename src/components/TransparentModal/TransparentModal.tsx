import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { CloseIcon } from '~/components/svg/CloseIcon'
import IconButton from '@mui/material/IconButton'
import { useStyles } from './styles'
import { useWindowSize } from '~/hooks/useWindowSize'

type TProps = {
  isOpened: boolean
  onClose: () => void
  children: any
}

export const TransparentModal = ({ isOpened, onClose, children }: TProps) => {
  const classes = useStyles()
  const { isMobile } = useWindowSize()

  return (
    <Dialog
      open={isOpened}
      onClose={onClose}
      aria-labelledby="scroll-stop-covid-dialog"
      // fullWidth
      maxWidth="md"
      className={classes.dialogWrapper}
    >
      <DialogTitle id="scroll-stop-covid-dialog" className={classes.dialogTitle}>
        <IconButton className={classes.closeIcon} edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon color="#FFF" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        className={classes.dialogContent}
        style={{
          paddingLeft: isMobile ? 0 : 24,
          paddingRight: isMobile ? 0 : 24,
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}
