export const snakesAndLadders = new Map<number, number>([
    [16, 6], // snake
    [47, 26], // snake
    [49, 11], // snake
    [56, 53], // snake
    [62, 19], // snake
    [64, 60], // snake
    [87, 24], // snake
    [93, 73], // snake
    [95, 75], // snake
    [98, 78], // snake
    [1, 38],  // ladder
    [4, 14],  // ladder
    [9, 31],  // ladder
    [21, 42],  // ladder
    [28, 84],  // ladder
    [36, 44],  // ladder
    [51, 67],  // ladder
    [71, 91],  // ladder
    [80, 100], // ladder
  ]);
  
  const movePlayer = (position: number, steps: number): number => {
    let newPosition = position + steps;
    if (newPosition > 100) return position; // Don't move if exceeds 100
  
    // Check if the player lands on a snake or ladder
    if (snakesAndLadders.has(newPosition)) {
      newPosition = snakesAndLadders.get(newPosition)!;
    }
    return newPosition;
  };
  
  export default { movePlayer };
  