import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';
import {useEffect, useState, useRef } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

import { useAuth } from './hooks/useAuth';
import ServerAuth from './ServerAuth';
import { ExitDialog, ResignDialog, ResultDialog } from './components/Dialogs';
import { makePGN } from './components/GameConfig';

const MyGame = () => {

  const auth = useAuth()
  const game = useRef(new Chess())
  const theme = useTheme()
  const thinking = useRef(Boolean())
  const [fen, setFen] = useState(null)
  const [selectedSquare, setSelectedSquare] = useState('')
  const [squareStyles, setSquareStyles] = useState({})
  const [resultDialog, setResultDialog] = useState([false, 'dnf'])
  const [exitDialog, setExitDialog] = useState(false)
  const [resignDialog, setResignDialog] = useState(false)
  const computerSide = auth.session.game.isBlack ? 'w' : 'b'

  useEffect(() => {
    // Init game on mount
    game.current.load_pgn(auth.session.game.pgn, {sloppy: true} )
    thinking.current = false
    setFen(game.current.fen()) 
  }, [])

  useEffect(() => {
    if (game.current.turn() == computerSide)
      makeEngineMove()
  }, [fen])

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    }

    if (!thinking.current)
      makeMove(move)
  }

  const makeEngineMove = () => {
    thinking.current = true
    const body = {
      thinkingTime: auth.session.game.thinkingTime.toString(),
      pvSort: auth.session.game.pvSort ? "1" : "0",
      fen: fen
    }

    ServerAuth.move(body, (res) => {
      if (res.data.success)
        makeMove(res.data.move)
      thinking.current = false
    })
  }

  const makeMove = (m) => {
    // Setting sloppy to true allows it to parse cheap blue's non standard move notation.
    const move = game.current.move(m, {sloppy: true})

    if (move === null)
      return
    setFen(game.current.fen())

    auth.saveGameConfig({
      ...auth.session.game,
      pgn: game.current.pgn()
    })
    
    if (game.current.game_over())
      endGame()
  }

  const endGame = (res) => {
    let result = res || 'dnf'
    if (game.current.in_checkmate())
      result = (game.current.turn() ==  computerSide) ? 'win' : 'loss'
    else if (game.current.in_draw())
      result = 'draw'
    
    if (result !== 'dnf' && result !== 'rsgn')
      setTimeout(setResultDialog, 1000, [true, result])


    const engine_config = {
      thinkingTime: auth.session.game.thinkingTime,
      killerMove: auth.session.game.killerMove,
      pvSort: auth.session.game.pvSort
    }

    const values = [
      auth.session.uid,
      auth.session.game.isBlack ? 'black' : 'white',
      engine_config,
      makePGN(auth.session.game.pgnHeader, game.current.pgn()),
      result
    ]

    ServerAuth.addgame(values)
  }

  const onSquareClick = (square) => {
    
    setSquareStyles({
      [square]: { backgroundColor: 'Turquoise' }
    })

    const move = {
      from: selectedSquare,
      to: square,
      promotion: 'q'
    }
    if (!thinking.current)
      makeMove(move)
    setSelectedSquare(square)
  }

  const handleCloseResultDialog = () => {
    setResultDialog([false, 'dnf'])
    auth.saveGameConfig(null)
  }

  const handleExit = () => {
    endGame()
    auth.saveGameConfig(null)
  }

  const exit = () => {
    if (!game.current.game_over())
      setExitDialog(true)
    else
      auth.saveGameConfig(null)
  }

  const handleResign = () => {
    endGame('rsgn')
    auth.saveGameConfig(null)
  }

  const resign = () => {
    setResignDialog(true)
  }

  return (
    <>
    <Stack padding={2} paddingBottom={0} direction="row">
      <Button variant="contained" onClick={exit}>Exit</Button>
      <Button onClick={resign}>Resign</Button>
    </Stack>
    
    <Box sx={{p: 2}}>
      <Chessboard
        calcWidth={({ screenWidth }) => (screenWidth < 500 ? 350 : 480)}
        id="normalGame"
        position={fen}
        onDrop={onDrop}
        boardStyle={{
          borderRadius: '5px',
          boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
        }}
        onSquareClick={onSquareClick}
        squareStyles={squareStyles}
        lightSquareStyle={{ backgroundColor: theme.palette.secondary.main }}
        darkSquareStyle={{ backgroundColor: theme.palette.primary.main }}
        orientation={auth.session.game.isBlack ? "black" : "white" }
      />
    </Box>
    
    <ResultDialog
      open={resultDialog[0]}
      result={resultDialog[1]}
      handleClose={handleCloseResultDialog}
    />
    <ExitDialog
      open={exitDialog}
      handleClose={() => setExitDialog(false)}
      handleExit={handleExit}
    />
    <ResignDialog
      open={resignDialog}
      handleClose={() => setResignDialog(false)}
      handleResign={handleResign}
    />
    </>
  )
}

export default MyGame;