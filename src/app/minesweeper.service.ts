// # Minesweeper

import { Injectable } from '@angular/core';

// ## 1. Problem Statement
// Given a 2D matrix of bits (1s are mines and 0s are safe), how do we create a game object that stores state properly and allows to play the game?

// ### 1. Input

// ```js
// var bombMatrix = [
//   [0, 1, 0, 0],
//   [0, 1, 1, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 1]
// ]
// ```

// ### 2. New Game

// ```js
// var game = new Minesweeper(bombMatrix);

// game.status => 'in-progress'

// game.state =>
// [
//   [ _ , _ , _ , _ ],
//   [ _ , _ , _ , _ ],
//   [ _ , _ , _ , _ ],
//   [ _ , _ , _ , _ ]
// ]
// ```

// ### 3. checkCell

// ##### case 1: One or more neighbor has a bomb
// *Checking cell reveals number of neighbors with a bomb*
// ```js
// game.checkCell(0,0);

// game.state =>
// [
//   [ 2 , _ , _ , _ ],
//   [ _ , _ , _ , _ ],
//   [ _ , _ , _ , _ ],
//   [ _ , _ , _ , _ ]
// ]
// ```

// ##### case 2: No neighbors have a bomb
// *Checking a cell that has no neighbors with a bomb reveals '0' and recursivley triggers checkCell on all neighbors*
// ```js
// game.checkCell(3,0);

// game.state =>

// [
//   [ 2 , _ , _ , _ ],
//   [ _ , _ , _ , _ ],
//   [ 1 , 2 , 3 , _ ],
//   [ 0 , 0 , 1 , _ ]
// ]
// ```

// ##### case 3: Checked cell has a bomb... you lose :(
// *Ends the game and reveals all cells*

// ```js
// game.checkCell(3,3); // reveals all cells and sets game.status to 'lose'

// game.status => 'you-lose'

// game.state =>
// [
//   [ 2 , B , 3 , 1 ],
//   [ 2 , B , B , 1 ],
//   [ 1 , 2 , 3 , 2 ],
//   [ 0 , 0 , 1 , B ]
// ]
// ```
// ##### case 4: Flagging hidden bombs
// *In order to win, you must flag all of the cells containing bombs. Any hidden cell can be flagged, but no uncovered cell can be flagged.*

// ```js
// game.flagCell(3,3); // marks the cell with 'F'

// game.state =>

// [
//   [ 2 , _ , _ , _ ],
//   [ _ , _ , _ , _ ],
//   [ 1 , 2 , 3 , _ ],
//   [ 0 , 0 , 1 , F ]
// ]
// ```

// ##### case 5: Last cell without a bomb is checked... you win!
// *The game is won when all cells that are bombs are flagged*

// ```js
// game.checkCell(y,x); // reveals all cells (only bombs at this point) and sets game.status to 'win'
// // game.status => 'you-win'
// ```
// Game state:
// ```js
// [
//   [ 2 , F , 3 , 1 ],
//   [ 2 , F , F , 1 ],
//   [ 1 , 2 , 3 , 2 ],
//   [ 0 , 0 , 1 , F ]
// ]
// ```

@Injectable({
  providedIn: 'root'
})
export class MinesweeperService {
  
  bombMatrix = [];
  state = [];
  bombCount = 0;
  status = 'in-progress';
  
  
  constructor() {}

  newGame(matrix) {
    this.bombMatrix = this.generateMatrix(4);
    this.state = matrix.map(row => row.map(cell => '_'));
    this.bombCount = matrix.reduce((count, row) => row.filter(cell => cell === 1).length + count, 0);
    this.status = 'in-progress';
  }

  generateMatrix(bombs) {
    const newMatrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    const bombLocation = () => [ Math.floor(Math.random() * 4), Math.floor(Math.random() * 4) ];
    const setLocation = () => {
      const [ x, y ] = bombLocation();
      if (newMatrix[y][x] === 1) {
        setLocation();
        return;
      }
      newMatrix[y][x] = 1;
    };
    for (let i = 0; i < bombs; i++) {
      setLocation();
    }
    return newMatrix;
  }
  
  checkCell(y, x) {
    if (this.state[y][x] !== '_') {
      return;
    }
    if (this.isBomb(x, y)) {
      this.state[y][x] = 'B';
      this.lose();
      return;
    }
    const xs = [ x - 1, x, x + 1 ];
    const ys = [ y - 1, y, y + 1 ];
    const neighborCount = xs.reduce((count, countX) => {
      const rowCount = ys.reduce((rowCount, countY) => rowCount + this.isBomb(countX, countY), 0);
      return count + rowCount;
    }, 0);
    this.state[y][x] = neighborCount;
    if (neighborCount === 0) {
      xs.forEach(newX => {
        ys.forEach(newY => {
          if (this.isInbounds(newX, newY)) {
            this.checkCell(newY, newX); 
          }
        });
      });
    }
  }
  
  flagCell(y, x) {
    this.state[y][x] = this.state[y][x] === '_' ? 'F' : this.state[y][x];
    this.checkWin();
  }
                                 
  isBomb(x, y) {
      if (!this.isInbounds(x, y)) {
        return 0;
      }
      return this.bombMatrix[y][x] === 1 ? 1 : 0;
  }
  
  isInbounds(x, y) {
    return y < this.bombMatrix.length && y >= 0 && x < this.bombMatrix[0].length && x >=0;
  }
  
  checkWin() {
    const flagCount = this.state.reduce((count, row, y) => row.filter((cell, x) => cell === 'F' && this.isBomb(x, y)).length + count, 0);
    console.log(flagCount);
    if (flagCount === this.bombCount) {
      this.status = 'you-win';
    }
  }
  
  lose() {
    this.bombMatrix.forEach((row, y) => row.forEach((cell, x) => this.checkCell(y, x)));
    this.status = 'you-lose';
  }
  
}

var bombMatrix = [
   [0, 1, 0, 0],
   [0, 1, 1, 0],
   [0, 0, 0, 0],
   [0, 0, 0, 1]
];