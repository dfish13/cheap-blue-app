import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

import { 
  AccountCircle,
  Menu as MenuIcon,
  Logout
} from '@mui/icons-material';

import { useAuth } from '../hooks/useAuth';
import { LoginDialog } from './Dialogs';
import { Stack } from '@mui/material';

export default function NavBar() {
  
  const auth = useAuth()
  const history = useHistory()
  
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] = useState(null)
  const [navMenuAnchorEl, setNavMenuAnchorEl] = useState(null)

  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  
  const handleMenu = (e, setAnchorEl) => { setAnchorEl(e.currentTarget) }
  const closeAccountMenu = () => { setAccountMenuAnchorEl(null) }
  const closeNavMenu = () => { setNavMenuAnchorEl(null) }

  const closeLoginDialog = () => {
    setLoginDialogOpen(false)
    closeAccountMenu()
  }

  const handleLogout = () => {
    auth.logout(closeAccountMenu)
    history.replace('/')
  }

  const clickNav = (route) => {
    closeNavMenu()
    history.push(route)
  }

  const accountMenuItems = () => {
    let menuItems = []
    if (auth.session) {
      menuItems.push(<MenuItem>{auth.session.uname}</MenuItem>)
      menuItems.push(
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" sx={{pr: 1}} />
          Logout
        </MenuItem>
      )
    } else {
      menuItems.push(<MenuItem onClick={() => setLoginDialogOpen(true)}>Login</MenuItem>)
    }
    return menuItems
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{p: 1}}>
            <img src={window.location.origin + '/logo64.png'} alt='Logo' />
          </Box>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, pl: 2 }}>
            Cheap Blue
          </Typography>
          {(
            <div>
              <Stack direction="row">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(e) => handleMenu(e, setNavMenuAnchorEl)}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(e) => handleMenu(e, setAccountMenuAnchorEl)}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Stack>
              <Menu
                id="account-menu-appbar"
                anchorEl={accountMenuAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(accountMenuAnchorEl)}
                onClose={closeAccountMenu}
              >
                {accountMenuItems()}
              </Menu>
              <Menu
                id="nav-menu-appbar"
                anchorEl={navMenuAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(navMenuAnchorEl)}
                onClose={closeNavMenu}
              >
                <MenuItem onClick={() => clickNav('/home')}>Home</MenuItem>
                <MenuItem onClick={() => clickNav('/about')}>About</MenuItem>
                <MenuItem onClick={() => clickNav('/play')}>Play</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <LoginDialog
        open={loginDialogOpen}
        handleClose={closeLoginDialog}
        loginCB={() => setLoginDialogOpen(false)}
      />
    </Box>
  )
}