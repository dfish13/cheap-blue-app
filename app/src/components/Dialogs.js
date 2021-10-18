import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useAuth } from '../hooks/useAuth';
import { Typography } from '@mui/material';

export const LoginDialog = ({open, handleClose}) => {

  const auth = useAuth()

  const [uname, setUname] = useState('')
  const [pass, setPass] = useState('')
  
  const [unameHelpText, setUnameHelpText] = useState('')
  const [passHelpText, setPassHelpText] = useState('')

  const cb = () => {
    clearText()
    handleClose()
  }

  const handleLogin = () => {
    auth.login(uname, pass, cb, handleError)
  }

  const handleNewUser = () => {
    auth.adduser(uname, pass, cb, handleError)
  }

  const clearHelpText = () => {
    setUnameHelpText('')
    setPassHelpText('')
  }

  const clearText = () => {
    clearHelpText()
    setUname('')
    setPass('')
  }

  const handleError = (data) => {
    clearHelpText()
    if (data.field == "uname")
      setUnameHelpText(data.message)
    else
      setPassHelpText(data.message)
  }

  const close = () => {
    clearText()
    handleClose()
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>
        <Typography>Login</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          If you do not already have an account make up a fun username and
          a secure password (I am actually storing hashed passwords on the
          database so feel free to make it something embarrassing like
          iPlayD4onMove1) and choose signup.
        </DialogContentText>
        <TextField
          autoFocus
          error={Boolean(unameHelpText)}
          value={uname}
          onChange={(e) => setUname(e.target.value)}
          id="username"
          label="Username"
          type="text"
          helperText={unameHelpText}
        />
        <TextField
          error={Boolean(passHelpText)}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          id="password"
          label="Password"
          type="password"
          helperText={passHelpText}
          autoComplete="current-password"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={handleNewUser}>Signup</Button>
      </DialogActions>
    </Dialog>
  )
}

export const ExitDialog = ({open, handleClose, handleExit}) => {

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Exit Game?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you exit now, the unfinished game will be saved to the database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExit}>Exit</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
  )
}

export const ResultDialog = ({open, result, handleClose}) => {

  const resultMessage = {
    win: {
      title: "You won!",
      contentText: "Nice job."
    },
    loss: {
      title: "You lost!",
      contentText: "No worries. Maybe try playing on easier settings!"
    },
    draw: {
      title: "It's a draw!",
      contentText: "Wow that was even steven."
    },
    dnf: {
      title: "DNF",
      contentText: "Did not finish."
    }
  }

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {resultMessage[result].title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {resultMessage[result].contentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
  )
}