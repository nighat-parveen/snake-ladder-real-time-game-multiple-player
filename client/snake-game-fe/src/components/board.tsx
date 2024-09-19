import React from "react";
import { snakesAndLadders } from "../utils/game";


const Board= ({ positions }: any) => {
    const positionPlayer = (positionTracker: boolean, i: number, j: number) =>  {
       return Number(positionTracker ? `${(i*10+1 - j)}` : `${((i*10)-10 + j)}`);
    }
  const createBoard = () => {
    const cells = [];
    let rightToLeft = true;
    for(let i = 10; i > 0; i--) {
        for(let j = 1; j <= 10; j++) {
            cells.push(
                <div key={`key${i}${j}`} className={`cell${i%2 === 0 ? j%2==0 ? ' fill' : '' : j%2!=0 ? ' fill' : ''}`}>
                  {
                    positions.includes(positionPlayer(rightToLeft, i, j))
                    ? `P${positions.indexOf(positionPlayer(rightToLeft, i, j)) + 1}`
                    : snakesAndLadders.has(positionPlayer(rightToLeft, i, j))
                    ? `🐍 ${positionPlayer(rightToLeft, i, j)}` 
                    : positionPlayer(rightToLeft, i, j) 
                }
                </div>
            );
        }

        rightToLeft = !rightToLeft;
    }
    return cells;
  };

  return <div className="boardSnake">{createBoard()}</div>;
};

export default Board;
