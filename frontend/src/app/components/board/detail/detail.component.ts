import { Component } from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { BoardList } from '../../../interfaces/board-list';
import { BoardDetail, BoardDetailMock } from '../../../interfaces/board-detail';
import { Subscription } from 'rxjs';
import { BoardService } from '../../../services/board.service';
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Todo } from '../../../interfaces/todo';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { TodoComponent } from '../../todo/todo.component';
import { NewBoardComponent } from '../new-board/new-board.component';
import { RouteService } from '../../../shared/route.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    CommonModule,
    TodoComponent,
    ColumnComponent,
    CdkDropListGroup,
    CdkDropList,
    NewBoardComponent
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {

  currentProjectID: number | null = null;

  userProjects: BoardList[] | null = null;
  selectedProject: BoardDetail = BoardDetailMock;

  subscriptions: Subscription[] = [];

  constructor(
      private board: BoardService,
      private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.subscribeToRouteId();
  }

  subscribeToRouteId() {
    // observe the url id and get the data once ready
    this.subscriptions.push(
        this.routeService.id$.subscribe((id) => {
            if (id) {
                this.subscribetoBoardDetail(id);
            }
        })
    );
  }

  drop(event: CdkDragDrop<Todo[]>, column: any) {
    if (event.previousContainer === event.container && event.previousIndex === event.currentIndex) {
        return;
    }

    if (event.previousContainer === event.container) {
        this.moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
        this.transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex,
        );
    }
    // Set the column on the item
    const item = event.container.data[event.currentIndex];
    item.column = column.id;

    //Item ready to save to db
    this.saveItem(item);
  }

  saveItem(todo: Todo) {
      this.board.updateItem(todo);
  }

  moveItemInArray(array: Todo[], fromIndex: number, toIndex: number) {
      const from = this.clamp(fromIndex, array.length - 1);
      const to = this.clamp(toIndex, array.length - 1);
      if (from === to) {
          return;
      }
      const target = array[from];
      const delta = to < from ? -1 : 1;
      for (let i = from; i !== to; i += delta) {
          array[i] = array[i + delta];
          array[i].order = i;
      }
      array[to] = target;
      array[to].order = to;
  }

  transferArrayItem(currentArray: Todo[], targetArray: Todo[], currentIndex: number, targetIndex: number) {
      const from = this.clamp(currentIndex, currentArray.length - 1);
      const to = this.clamp(targetIndex, targetArray.length);
      if (currentArray.length) {
          const currentElement = currentArray.splice(from, 1)[0];
          currentElement.order = to;
          targetArray.splice(to, 0, currentElement);
      }
  }

  clamp(value: number, max: number): number {
      return Math.max(0, Math.min(max, value));
  }

  subscribetoBoardDetail(id: number) {
      this.subscriptions.push(
          this.board.getBoardDetail(id).subscribe(board => {
            this.selectedProject = board;
          })
      );
  }

  logActiveSubscribers() {
      console.log(this.subscriptions.filter(sub => !sub.closed));
  }

  logInactiveSubscribers() {
      console.log(this.subscriptions.filter(sub => sub.closed));
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach((sub) => {
          sub.unsubscribe()
      });
  }

}
