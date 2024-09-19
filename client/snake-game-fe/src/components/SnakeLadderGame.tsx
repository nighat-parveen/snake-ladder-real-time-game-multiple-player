import React, { useEffect, useState } from 'react'
// import game from '../utils/game';
import io from 'socket.io-client';

import Board from './board';
import Dice from './Dice';

const socketPlayer = io('http://localhost:3000', {
  withCredentials: true,
});

interface IGameState {
  players: string[];
  currentPlayerIndex: number;
  positions: number[];
  diceNumber?: number;
}

const SnakeLadderGame = () => {
  const [gameState, setGameState] = useState<IGameState>({
    players: [],
    currentPlayerIndex: 0,
    positions: [0,0] 
  })
  const [isMyTurn, setIsMyTurn] = useState(true);


  // const [positions, setPositions] = useState([0, 0]); // Assume two players starting at 0
  // const [currentPlayer, setCurrentPlayer] = useState(0);

  useEffect(() => {
    socketPlayer.on('gameStateUpdate', (gameState: any) => {
      setGameState(gameState);
      setIsMyTurn(gameState.players[gameState.currentPlayerIndex] === socketPlayer.id);
    });

    socketPlayer.on('disconnects', () => {
      console.log('disconnected');
      socketPlayer.disconnect();
    })

    // return () => {
    //   socketPlayer.off('gameStateUpdate');
    //   socketPlayer.off('rollDice');
    //   socketPlayer.disconnect();
    // }
  }, []);

  const handleRollDice = () => {
    socketPlayer.emit('rollDice');
    setIsMyTurn(false);
  } 

  const displayPosition = () => {
    return gameState.players.map((player, index) => 
       <div key = {player}>
        <p style={{backgroundColor: index === gameState.currentPlayerIndex ? 'red' : 'white'}}>
          <span>{player}:</span>
          <span>{gameState.positions[index]}</span>
        </p>
        {player}: {gameState.positions[index]}
      </div>
    );
  }

  // const handleMove = (diceValue: number) => {
  //   const newPositions = [...positions];
  //   const newPosition = game.movePlayer(positions[currentPlayer], diceValue);
  //   newPositions[currentPlayer] = newPosition;
  //   setPositions(newPositions);
  //   setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % positions.length);
  // };
  return (
    <div style={{display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
      <Board 
        positions={gameState.positions} 
      />
      Dice: {gameState.diceNumber}
      {
        isMyTurn ? <Dice
        onRoll={handleRollDice}
       /> : null
      }
      
      <p>{isMyTurn ? "My " : "Waiting for others"}'s turn</p>
      <p>Current Player: {socketPlayer.id}</p>
      <p>Current Position: {displayPosition()}</p>
    </div>
  )
}

export default SnakeLadderGame;
