import styled from "styled-components";


const Button = styled.button`
  color: white;
  background: royalblue;
  font-size: 1em;
  margin: 0.2em;
  padding: 0.2em 1em;
  border: 2px solid royalblue;
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