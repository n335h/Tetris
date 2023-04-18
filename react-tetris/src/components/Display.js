import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay';

const Display = ({ gameOver, text }) => (
  <StyledDisplay gamesOver={gameOver}>{text}</StyledDisplay>
);

export default Display;
