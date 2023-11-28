import { useState, useCallback } from 'react'
import {
  Badge,
  Button,
  Menu,
  MenuItem,
} from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import {
  ButtonPropsVariantOverrides,
  ButtonPropsColorOverrides,
  ButtonPropsSizeOverrides,
  ListItemIcon,
  Typography,
} from '@mui/material'
import Fade from '@mui/material/Fade'
// import Divider from '@mui/material/Divider'

type TItem = {
  label: string;
  value: string | number | null;
  ItemIcon?: React.ReactNode;
  hasDividerAfter?: boolean;
};
type TProps = {
  btn: {
    variant: OverridableStringUnion<
      'text' | 'outlined' | 'contained',
      ButtonPropsVariantOverrides
    >;
    color: OverridableStringUnion<
      'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
      ButtonPropsColorOverrides
    >;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    size?: OverridableStringUnion<'small' | 'medium' | 'large', ButtonPropsSizeOverrides>;
  };
  label: string;
  items: TItem[];
  onSelect: (item: TItem) => void;
  isDisabled?: boolean;
  badgeCounter?: number;
}

export const MenuAsBtn = ({
  label: btnLabel,
  btn,
  items,
  onSelect,
  isDisabled,
  badgeCounter,
}: TProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, [setAnchorEl])
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl])
  const handleSelect = useCallback((item: TItem) => (_e: any) => {
    onSelect(item)
    handleClose()
  }, [onSelect, handleClose])

  return (
    <>
      {
        !!badgeCounter ? (
          <Badge badgeContent={badgeCounter} color="primary">
            <Button
              id="demo-positioned-button"
              aria-controls={open ? 'demo-positioned-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              color={btn.color}
              variant={btn.variant}
              startIcon={btn.startIcon}
              endIcon={btn.endIcon}
              size={btn.size}
              disabled={isDisabled}
            >
              {btnLabel.length > 7 ? `${btnLabel.substring(0, 7)}...` : btnLabel}
            </Button>
          </Badge>
        ) : (
          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color={btn.color}
            variant={btn.variant}
            startIcon={btn.startIcon}
            endIcon={btn.endIcon}
            size={btn.size}
            disabled={isDisabled}
          >
            {btnLabel.length > 7 ? `${btnLabel.substring(0, 7)}...` : btnLabel}
          </Button>
        )
      }
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          maxWidth: '350px',
        }}
        TransitionComponent={Fade}
      >
        {
          items.map(({
            value, label, ItemIcon,
            // hasDividerAfter,
          }, i) => {
            // const isSelected = label === btnLabel
            // if (hasDividerAfter) return (
            //   <Fragment key={`${label}-${i}`}>
            //     <MenuItem
            //       onClick={handleSelect({ value, label })}
            //     >
            //       {
            //         !!ItemIcon
            //         ? (
            //           <>
            //             <ListItemIcon>{ItemIcon}</ListItemIcon>
            //             <Typography variant="inherit">{label}</Typography>
            //           </>
            //         ) : (
            //           <span className='truncate'>{label}</span>
            //         )
            //       }
            //     </MenuItem>
            //     {hasDividerAfter && <Divider />}
            //   </Fragment>
            // )
            return (
              <MenuItem
                onClick={handleSelect({ value, label })}
                key={`${label}-${i}`}
              >
                {
                  !!ItemIcon
                  ? (
                    <>
                      <ListItemIcon>{ItemIcon}</ListItemIcon>
                      <Typography variant="inherit">{label}</Typography>
                    </>
                  ) : (
                    <span className='truncate'>{label}</span>
                  )
                }
              </MenuItem>
            )
          })
        }
      </Menu>
    </>
  )
}
