import React, { useState } from "react";



const Dice = ({ onRoll }: any) => {
  const [diceValue, setDiceValue] = useState(1);

  const rollDice = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);
    onRoll(newValue);
  };

  return (
    <div>
      <p style={{backgroundColor: 'white', padding: '5px'}}>Dice: {diceValue}</p>
      <button onClick={rollDice} type="button" style={{backgroundColor: 'grey', padding: '5px', border: '1px solid black'}}>Roll Dice</button>
      
    </div>
  );
};

export default Dice;
