import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';
import {useEffect, useState, useRef } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { 
  CircularProgress,
  Typography,
  useTheme,
  LinearProgress
} from '@mui/material';

import { PromotionDialog } from './Dialogs';
import ServerAuth from '../ServerAuth';

const AnalysisBoard = () => {

  const game = useRef(new Chess())
  const theme = useTheme()
  const [fen, setFen] = useState(null)
  const [selectedSquare, setSelectedSquare] = useState('')
  const [squareStyles, setSquareStyles] = useState({})
  const [orientation, setOrientation] = useState('white')
  const [promotionDialog, setPromotionDialog] = useState([false, 'e2', 'e2'])
  const [promotionPiece, setPromotionPiece] = useState('q')
  const [evaluation, setEvaluation] = useState({eval: 0.0, move: ""})
  const [loading, setLoading] = useState(false)
  
  const potentialMoveStyle = { background: "radial-gradient(circle, SpringGreen 30%, transparent 30%)" }

  useEffect(() => {
    setFen(game.current.fen())
  }, [])

  useEffect(() => {
    const move = {
      from: promotionDialog[1],
      to: promotionDialog[2],
      promotion: promotionPiece
    }

    makeMove(move)
    setSquareStyles({})
  }, [promotionPiece])

  useEffect(() => {
    getEngineEval()
    setLoading(true)
  }, [fen])

  const isPromotion = (sourceSquare, targetSquare) => {
    const moves = game.current.moves({
      square: sourceSquare,
      verbose: true
    })
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].promotion)
        return true
    }
    return false
  }

  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (isPromotion(sourceSquare, targetSquare))
    {
      setPromotionDialog([true, sourceSquare, targetSquare])
      return
    }
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    }

    makeMove(move)
    setSquareStyles({})
  }

  const makeMove = (m) => {
    // Setting sloppy to true allows it to parse cheap blue's non standard move notation.
    const move = game.current.move(m, {sloppy: true})

    if (move === null)
      return false
    setFen(game.current.fen())
    return true
  }

  const getEngineEval = () => {
    const body = {
      thinkingTime: "2",
      fen: fen
    }

    ServerAuth.eval(body, (res) => {
      if (res.data.success)
        setEvaluation({eval: Number(res.data.eval) / 100.0, move: res.data.move})
      setLoading(false)
    })
  }

  const onSquareClick = (square) => {
    
    if (selectedSquare)
    {
      setSelectedSquare('')
      setSquareStyles({})
      if (square !== selectedSquare)
      {
        const move = {
          from: selectedSquare,
          to: square,
          promotion: 'q'
        }
        makeMove(move)
      }
      else
        return
    }
    const moves = game.current.moves({
      square: square,
      verbose: true
    })

    if (moves.length === 0) return

    let s = []
    for (var i = 0; i < moves.length; i++)
      s.push(moves[i].to)
    highlightMoves(s)
    setSelectedSquare(square)
  }

  const highlightMoves = (squares) => {
    let squareStyles = {}
    for (const square of squares)
      squareStyles[square] = potentialMoveStyle
    setSquareStyles(squareStyles)
  }

  const undo = () => {
    const move = game.current.undo()
    
    if (move === null)
      return
    setFen(game.current.fen())
    setSquareStyles({})
  }

  const flipBoard = () => {
    if (orientation === 'white')
      setOrientation('black')
    else
      setOrientation('white')
  }

  const handlePromotion = (pieceChar) => {
    setPromotionPiece(pieceChar)
    setPromotionDialog([false, promotionDialog[1], promotionDialog[2]])
  }

  return (
    <>
    <Stack padding={2} paddingBottom={0} direction="row">
      <Button variant="contained" onClick={undo}>Undo</Button>
      <Button onClick={flipBoard}>Flip Board</Button>
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
        orientation={orientation}
      />
    </Box>
    <Stack padding={2} paddingTop={0} direction="column">
      <EvalBox evaluation={evaluation} />
      { loading && <CircularProgress thickness={4} /> }
    </Stack>
    
    <PromotionDialog
      open={promotionDialog[0]}
      handlePromotion={handlePromotion}
    />
    </>
  )
}

const EvalBox = ({ evaluation }) => {
  const theme = useTheme()

  const sign = (evaluation.eval < 0.0) ? -1.0 : 1.0
  const offset = 25.0 * Math.log10(1.0 + Math.abs(evaluation.eval))


  const progress = Math.round(50 + (sign * offset))
  return (
    <Box bgcolor={theme.palette.primary.light} width={350} marginBottom={2}>
      <Typography >Evaluation = {evaluation.eval}</Typography>
      <Typography>Top move = {evaluation.move}</Typography>
      <LinearProgress sx={{height: 10, color: "black"}} variant="determinate" width={350} value={progress}></LinearProgress>
    </Box>
  )
}

export default AnalysisBoard;