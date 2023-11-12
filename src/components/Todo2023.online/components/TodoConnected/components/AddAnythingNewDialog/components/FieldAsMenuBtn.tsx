import { useState, useCallback } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

type TProps = {
  label: string;
  placeholder: string;
  items: { label: string; value: string; }[];
  onSelect: ({ value, label }: { value: string; label: string; }) => void;
}

export const FieldAsMenuBtn = ({
  label,
  // placeholder,
  items,
  onSelect,
}: TProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    // console.log(event.currentTarget.value)
    setAnchorEl(event.currentTarget);
  }, [])
  const handleSelect = useCallback(({ label, value }) => {
    onSelect({ label, value })
    handleClose()
  }, [onSelect, handleClose])

  return (
    <div>
      <Button
        id='basic-button'
        variant='outlined'
        size='small'
        fullWidth
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {label}
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
          items.map(({ label, value }, i) => {
            return (
              <MenuItem key={`${value}-${i}`} onClick={() => handleSelect({ label, value })}>{label}</MenuItem>
            )
          })
        }
      </Menu>
    </div>
  )
}
