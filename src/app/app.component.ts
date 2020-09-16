import { Component } from '@angular/core';
import { MinesweeperService } from './minesweeper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  bombMatrix = [
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1]
  ];
  state = [];
  bombsLeft = 0;
  gameTime = 0;
  status = 'no-game';
  timerInterval;

  constructor(
    private minesweeperService: MinesweeperService
  ) {}

  setState() {
    this.state = this.minesweeperService.state;
    this.status = this.minesweeperService.status;
  }

  checkCell(y, x) {
    this.minesweeperService.checkCell(y, x);
    this.setState();
  }

  flagCell(event, y, x) {
    event.preventDefault();
    this.minesweeperService.flagCell(y, x);
    this.setState();
  }

  startGame() {
    this.minesweeperService.newGame(this.bombMatrix);
    this.setState();
    this.gameTime = 0;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.gameTime = this.gameTime + 1, 1000);
  }

}
