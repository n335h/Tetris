import React, { useState } from 'react';

import { createStage } from '../gameHelpers';
import { checkCollision } from '../gameHelpers';

//styled components
import {
  StyledTetrisWrapper,
  StyledTetris,
} from './styles/StyledTetris';

//Custom Hooks
import { useInterval} from'../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';

//components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { useGameStatus } from '../hooks/useGameStatus';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] =
    usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  const movePlayer = (dir) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 }))
      // if there is no collision then move as below
      updatePlayerPos({ x: dir, y: 0 });
  };
  // x= dir because we are moving left or right refering to move, y= 0 because we are not moving up or down

  const startGame = () => {
    //reset everything

    setDropTime (1000);
    setStage(createStage());
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);

  };

  const drop = () => {
    // increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      // Also increase speed
      setDropTime(1300 / (level + 1) + 200);
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log('GAME OVER!!!');
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };
const keyUP = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        setDropTime(1300 / (level + 1) + 200);
      }
    }
  };



  // as we drop we increase the y value of 1
  const dropPlayer = () => {
    setDropTime(null);
    drop();

  };

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      } else if (keyCode === 32) {
        dropPlayer();
      }
    }
  };

  // 37 = left arrow (-1) because left is -1 on x axis , 39 = right arrow (1) because right is 1 on x axis, 40 = down arrow (1) because down is 1 on y axis
  // 38 = up arrow (1) because up is 1 on y axis
useInterval(() => {
    drop();
  }, dropTime);



  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUP}
    >
      {/* // if we didnt have wrapper, you would have to press on game screen for the key presses to work */}

      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? ( // if gameOver is true, display Game Over, else display score, rows, level
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`}/>
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
