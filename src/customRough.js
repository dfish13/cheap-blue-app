/*
    import rough from 'roughjs' does not work
    https://github.com/rough-stuff/rough/issues/99
*/
import rough from 'roughjs/bundled/rough.cjs.js';

export const roughSquare = ({ squareElement, squareWidth }) => {
  let rc = rough.svg(squareElement);
  const chessSquare = rc.rectangle(0, 0, squareWidth, squareWidth, {
    roughness: 0.5,
    fill: 'Cornsilk',
    bowing: 0.5,
  });
  squareElement.appendChild(chessSquare);
};