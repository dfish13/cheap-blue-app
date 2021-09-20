import styled from "styled-components";


const Button = styled.button`
  color: white;
  background: cornflowerblue;
  font-size: 1.3em;
  font-family: courier;
  margin: 0.25em;
  padding: 0.25em 1em;
  border: 2px solid cornflowerblue;
  border-radius: 3px;
`;

const PlayAsButton = styled(Button)`
    color: ${props => props.black ? "white" : "black"};
    background: ${props => props.black ? "black" : "white"};
    border-color: black;
`;

const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

const Table = styled.table`
  border-spacing: 0
  border: 1px solid black
  border-radius: 3px;
`;

const Td = styled.td`
  border: 1px solid black
`;

export {Button, TomatoButton, PlayAsButton, Table, Td};