import Chessboard from 'chessboardjsx';
import Chess from 'chess.js';
import { Component} from 'react';
import PropTypes from 'prop-types';

import {Button, PlayAsButton} from './StyledComponents';
import { roughSquare } from './customRough';

const axios = require('axios');


class NormalGame extends Component {
  static propTypes = { children: PropTypes.func };

  state = { fen: 'start', squareStyles: {}, pieceSquare: '', side: 'white'};

  componentDidMount() {
    this.game = new Chess();
  }

  onDrop = ({ sourceSquare, targetSquare }) => {
    var move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });

    if (move === null) return;

    this.setState({fen: this.game.fen()});
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
  };

  makeEngineMove = () => {
    axios.post('/move', { fen: this.game.fen()})
    .then((res) => {
      this.game.move(res.data);
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
      side: side
    });
  }
}

/*
function TalkToServerBox(props) {

  const [text, setText] = useState("Default");

  const talkToServer = () => {
    axios.post('/move', { fen: props.getFen()})
    .then((res) => {setText(res.data)})
    .catch((err) => console.log(err));
  }

  return (
    <div>
      <button onClick={talkToServer}> Talk To Server </button>
      <textarea value={text}/>
    </div>
  )
}
*/

function NormalGameBoard() {

  return (
    <NormalGame>
        {({ makeEngineMove, position, onDrop, onSquareClick, squareStyles, takeBack, pickSide, side }) => (
          <div>
            <Button onClick={takeBack}> Take Back </Button>
            <Button onClick={makeEngineMove}> Make Engine Move </Button>
            <Chessboard
            calcWidth={({ screenWidth }) => (screenWidth < 500 ? 350 : 480)}
            id="normalGame"
            position={position}
            onDrop={onDrop}
            boardStyle={{
              borderRadius: '5px',
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
            roughSquare={roughSquare}
            onSquareClick={onSquareClick}
            squareStyles={squareStyles}
            lightSquareStyle={{ backgroundColor: "AliceBlue" }}
            darkSquareStyle={{ backgroundColor: "CornFlowerBlue" }}
            orientation={side}
            />
            <PlayAsButton onClick={() => pickSide('white')}>Play as White</PlayAsButton>
            <PlayAsButton onClick={() => pickSide('black')} black>Play as Black</PlayAsButton>
          </div>
        )}
      </NormalGame>
  )
}

function App() {
  return (
    <div className="App">
        <NormalGameBoard/>
    </div>
  );
}

export default App;
