import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';
import {useEffect, useState, useRef } from 'react';

import {TomatoButton } from './components/StyledComponents';
import { useAuth } from './hooks/useAuth';
import ServerAuth from './ServerAuth';
import { ExitDialog, ResultDialog } from './components/Dialogs';

const MyGame = () => {

  const auth = useAuth()
  const game = useRef(new Chess())
  const [fen, setFen] = useState(null)
  const [selectedSquare, setSelectedSquare] = useState('')
  const [squareStyles, setSquareStyles] = useState({})
  const [resultDialog, setResultDialog] = useState([false, 'dnf'])
  const [exitDialog, setExitDialog] = useState(false)
  const computerSide = auth.session.game.isBlack ? 'w' : 'b'

  useEffect(() => {
    // Init game on mount
    game.current.load_pgn(auth.session.game.pgn, {sloppy: true} )
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
    makeMove(move)
  }

  const makeEngineMove = () => {
    ServerAuth.move(fen, (res) => {
      console.log(res.data.message)
      if (res.data.success)
        makeMove(res.data.move)
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

  const endGame = () => {
    let result = 'dnf'
    if (game.current.in_checkmate())
      result = (game.current.turn() ==  computerSide) ? 'win' : 'loss'
    else if (game.current.in_draw())
      result = 'draw'
    
    if (result !== 'dnf')
      setTimeout(setResultDialog, 1000, [true, result])

    const values = [
      auth.session.uid,
      auth.session.game.isBlack ? 'black' : 'white',
      auth.session.game.pgn,
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
    makeMove(move)
    setSelectedSquare(square)
  }

  const handleCloseResultDialog = () => {
    setResultDialog([false, 'dnf'])
  }

  const handleExit = () => {
    endGame()
    auth.saveGameConfig(null)
  }

  const exit = () => {
    console.log('exit')
    if (!game.current.game_over())
      setExitDialog(true)
    else
      auth.saveGameConfig(null)
  }

  return (
    <>
    <TomatoButton onClick={exit}> Exit </TomatoButton>
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
      lightSquareStyle={{ backgroundColor: "Cornsilk" }}
      darkSquareStyle={{ backgroundColor: "RoyalBlue" }}
      orientation={auth.session.game.isBlack ? "black" : "white" }
    />
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
    </>
  )
}

const FenBox = ({fen, passFenUp}) => {

  const [fenString, setFenString] = useState(fen)

  // Because fen never changes after component is created this effect is only performed once.
  useEffect(() => setFenString(fen), [fen])

  const loadFen = () => {
    passFenUp(fenString)
  }

  return (
    <div>
      <textarea cols={fenString.length + 1} value={fenString} onChange={(e) => {setFenString(e.target.value)}}/>
      <br/>
      <button onClick={loadFen}>Load FEN</button>
    </div>
  )
}

export default MyGame;