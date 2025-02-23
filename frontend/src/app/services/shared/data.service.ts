import { Injectable } from '@angular/core';
import { BoardDetail } from '../../interfaces/board-detail';
import { BoardList } from '../../interfaces/board-list';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  /**
   * Holds board information
   */
  board: BoardDetail | null = null;
  boardlist: BoardList[] | null = null;
}
