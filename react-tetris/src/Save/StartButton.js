import React from 'react';
import { StyledStartButton } from '../components/styles/StyledStartButton';

const StartButton = ({ callback }) => (
  <StyledStartButton onClick={callback}>
    {' '}
    Start Game{' '}
  </StyledStartButton>
);
export default StartButton;
