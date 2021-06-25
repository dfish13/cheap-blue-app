import styled from "styled-components";


const Button = styled.button`
  color: dodgerblue;
  font-size: 1em;
  margin: 0.25em;
  padding: 0.25em 1em;
  border: 2px solid dodgerblue;
  border-radius: 3px;
`;

const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

export {Button, TomatoButton};