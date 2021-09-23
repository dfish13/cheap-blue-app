import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';
import {useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';

import {Button, PlayAsButton} from './StyledComponents';
import PerftUtil from './PerftUtil';

const axios = require('axios');

class NormalGame extends Component {
  static propTypes = { children: PropTypes.func };

  state = {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    squareStyles: {},
    pieceSquare: '',
    side: 'white'
  };

  componentDidMount() {
    this.game = new Chess();
  }

  onDrop = ({ sourceSquare, targetSquare }) => {
    let move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });

    if (move === null) return;

    this.setState({fen: this.game.fen()});
    this.makeEngineMove()
  };

  onSquareClick = square => {
    this.setState({
      squareStyles: { [square]: { backgroundColor: 'Turquoise' } },
      pieceSquare: square
    });

    let move = this.game.move({
      from: this.state.pieceSquare,
      to: square,
      promotion: 'q'
    });

    // illegal move
    if (move === null) return;

    this.setState({ fen: this.game.fen() });
    this.makeEngineMove()
  };

  makeEngineMove = () => {
    axios.post('/move', { fen: this.game.fen()})
    .then((res) => {
      if (res.data === "None")
      {
        console.log('No legal moves.')
        return;
      }

      // Setting sloppy to true allows it to parse cheap blue's non standard move notation.
      this.game.move(res.data, {sloppy: true});
      this.setState({ fen: this.game.fen() });
    })
    .catch((err) => console.log(err));
  }

  takeBack = () => {
    let move = this.game.undo();
    if (move === null) return;

    this.setState({ fen: this.game.fen() });
  }

  pickSide = (color) => {
    this.setState({side: color});
  }

  getFenFromChild = (fen) => {
    const test = this.game.validate_fen(fen)
    if (test.valid)
    {
      this.game.load(fen)
      this.setState({ fen: this.game.fen() })
    }
    else
      console.log(test.error)
  }

  getFen = () => {
    return this.game.fen();
  }

  render() {
    const { fen, squareStyles, side} = this.state;
    return this.props.children({
      makeEngineMove: this.makeEngineMove,
      position: fen,
      onDrop: this.onDrop,
      onSquareClick: this.onSquareClick,
      squareStyles,
      takeBack: this.takeBack,
      pickSide: this.pickSide,
      passFenUp: this.getFenFromChild,
      side: side
    });
  }
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
      <button onClick={loadFen}>Load FEN</button>
      <textarea cols={fenString.length + 1} value={fenString} onChange={(e) => {setFenString(e.target.value)}}/>
    </div>
  )
}


const NormalGameBoard = ({admin}) => {

  return (
    <NormalGame>
        {({ makeEngineMove, position, onDrop, onSquareClick, squareStyles, takeBack, pickSide, passFenUp, side }) => (
          <div>
            <Button onClick={takeBack}> Take Back </Button>
            {admin && <Button onClick={makeEngineMove}> Engine Move </Button>}
            <PlayAsButton onClick={() => pickSide('white')}>Play White</PlayAsButton>
            <PlayAsButton onClick={() => pickSide('black')} black>Play Black</PlayAsButton>
            <Chessboard
            calcWidth={({ screenWidth }) => (screenWidth < 500 ? 350 : 480)}
            id="normalGame"
            position={position}
            onDrop={onDrop}
            boardStyle={{
              borderRadius: '5px',
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
            // roughSquare={roughSquare}
            onSquareClick={onSquareClick}
            squareStyles={squareStyles}
            lightSquareStyle={{ backgroundColor: "Cornsilk" }}
            darkSquareStyle={{ backgroundColor: "RoyalBlue" }}
            orientation={side}
            />
            <br/>
            {admin &&
              <div>
                <FenBox fen={position} passFenUp={passFenUp}/>
                <PerftUtil fen={position}/>
              </div>
            }
          </div>
        )}
      </NormalGame>
  )
}

function App() {
  return (
    <div className="App">
        <NormalGameBoard admin/>
    </div>
  );
}

export default App;
