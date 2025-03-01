import { Injectable } from '@angular/core';
import { BoardDetail } from '../../interfaces/board-detail';
import { BoardList } from '../../interfaces/board-list';
import { BehaviorSubject, firstValueFrom, lastValueFrom } from 'rxjs';
import { BoardDataService } from '../board-data.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private dataService: BoardDataService
  ) { }

  private boardListSubject = new BehaviorSubject<BoardList[]|null>(null);
  boardList$ = this.boardListSubject.asObservable();

  private boardSubject = new BehaviorSubject<BoardDetail|null>(null);
  boardDetail$ = this.boardSubject.asObservable();


  getLatestBoardList(): Promise<BoardList[]|null> {
    return lastValueFrom(this.boardList$);
  }

  getLatestBoardDetail(): Promise<BoardDetail|null> {
    return lastValueFrom(this.boardDetail$);
  }

  async fetchBoardDetail(id: number): Promise<void> {
    const board = await firstValueFrom(this.dataService.getBoardData(id))
    this.boardSubject.next(board);
  }

  async fetchBoardList(): Promise<void> {
    const boardlist = await firstValueFrom(this.dataService.getBoardListData())
    this.boardListSubject.next(boardlist);
  }

  setBoardList(data: BoardList[]) {
    this.boardListSubject.next(data);
  }

  setBoard(data: BoardDetail) {
    this.boardSubject.next(data);
  }
}
