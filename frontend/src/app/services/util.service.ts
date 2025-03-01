import { Injectable } from '@angular/core';
import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private bs: BoardService
  ) { }

  refresh() {
    window.location.reload();
  }

  loadBoardOrNew() {
    this.bs.loadLatestBoardOrNew();
  }
}
