import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

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


export const LoginDialog = () => {
  return (
    <div>
      <Dialog open={true} onClose={() => console.log('close')}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You need to log in to play against the engine because
            computation is done on the server side and I would rather
            not let some anonymous visitor, possibly russian or chinese bot, 
            spam the engine with requests and then get a big bill 
            from Jeff Bezos because I made his servers work too hard.
            Also I went through the trouble of adding a database and user
            authentication which was just a joy and definitely not a shit show.
            So please enjoy the fruits of my labor
            and be sure to make up a funny username and a password that ends 
            with 69 ;)
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => console.log('close')}>Cancel</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  )
}