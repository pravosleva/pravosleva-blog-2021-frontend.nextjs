import  { useState, MouseEvent, useCallback } from 'react'
import {
  // Avatar,
  // Divider,
  IconButton,
  // ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  // Typography,
 } from '@mui/material'
// import PersonAdd from '@mui/icons-material/PersonAdd'
// import {
//   Settings,
// } from '@mui/icons-material'
// import Logout from '@mui/icons-material/Logout'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'

type TProps = {
  onEdit: () => void;
  onDelete: () => void;
  // item: {
  //   id: string;
  //   name: string;
  //   description: string;
  //   mileage: number;
  // };
}
export const ProjectMenu = ({
  onEdit,
  onDelete,
}: TProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, [])
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [])

  return (
    <>
      <Tooltip title='Project menu'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{
            ml: 2,
          }}
          aria-controls={open ? 'project-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <Divider /> */}
        <MenuItem>
          <IconButton
            color='default'
            aria-label="edit-project"
            onClick={onEdit}
          >
            <EditIcon />
          </IconButton>
        </MenuItem>
        <MenuItem>
          <IconButton
            color='error'
            aria-label="delete-project"
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        </MenuItem>
      </Menu>
    </>
  );
}
