import { useState, useCallback } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { OverridableStringUnion } from '@mui/types'
import {
  ButtonPropsVariantOverrides,
  ButtonPropsColorOverrides,
  ButtonPropsSizeOverrides,
} from '@mui/material'

type TItem = {
  label: string;
  value: string | number | null;
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
}

export const MenuAsBtn = ({
  label: btnLabel,
  btn,
  items,
  onSelect,
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
      >
        {btnLabel}
      </Button>
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
      >
        {
          items.map(({ value, label }, i) => {
            // const isSelected = label === btnLabel
            return (
              <MenuItem
                key={`${label}-${i}`}
                onClick={handleSelect({ value, label })}
              >
                {label}
              </MenuItem>
            )
          })
        }
      </Menu>
    </>
  )
}
