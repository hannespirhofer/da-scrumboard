import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink, RouterModule } from "@angular/router";
import { BoardList } from "../../interfaces/board-list";
import { CommonModule } from "@angular/common";
import { BoardService } from "../../services/board.service";
import { Subscription } from "rxjs";
import { BoardDetail, BoardDetailMock } from "../../interfaces/board-detail";
import { TodoComponent } from "../todo/todo.component";
import { HeaderComponent } from "./header/header.component";
import {
    CdkDragDrop,
    CdkDropList,
    CdkDropListGroup,
  } from '@angular/cdk/drag-drop';
import { Todo } from "../../interfaces/todo";
import { ColumnComponent } from "./column/column.component";
import { NewBoardComponent } from "./new-board/new-board.component";

@Component({
    selector: "app-board",
    standalone: true,
    imports: [
        HeaderComponent,
        RouterModule,
        RouterLink,
        CommonModule,
        TodoComponent,
        ColumnComponent,
        CdkDropListGroup,
        CdkDropList,
        NewBoardComponent
    ],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.scss",
})
export class BoardComponent implements OnInit, OnDestroy {

    isOwner: Boolean = false;
    currentProjectID: number | null = null;
    isBoardSelected: boolean = false;

    userProjects: BoardList[] | null = null;
    selectedProject: BoardDetail = BoardDetailMock;

    subscriptions: Subscription[] = [];

    constructor(
        private board: BoardService,
        private route: ActivatedRoute //private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.subscribetoBoardList();

        // observe the url id and get the data once ready
        this.subscriptions.push(
            this.route.params.subscribe((p) => {
                const idparam: string = p['id'];
                const id: number = +idparam;

                if (id && typeof id === "number") {
                    this.isBoardSelected = true;
                    this.currentProjectID = id;
                    this.subscribetoBoardDetail(id);
                } else {
                    this.isBoardSelected = false;
                }
            })
        );
    }

    drop(event: CdkDragDrop<Todo[]>, column: any) {
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

    saveItem(item: Todo) {
        this.board.saveItem(item)
            .then((msg: any) => {
                console.log('Todo saved. ', msg);
            })
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
                console.log('Board Detail from /boards/:id is: ', board);
            })
        );
    }

    subscribetoBoardList() {
        this.subscriptions.push(
            this.board.getBoardList().subscribe(list => {
                this.userProjects = list;
                console.log('Board List from /boards/ is: ', list);
            })
        );
    }

    logActiveSubscribers() {
        console.log(this.subscriptions.filter(sub => !sub.closed));
    }

    logInactiveSubscribers() {
        console.log(this.subscriptions.filter(sub => !sub.closed));
    }

    getOwner() {
        return this.isOwner;
    }

    setOwner(val: Boolean) {
        this.isOwner = val;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub, idx) => {
            sub.unsubscribe()
        });
    }
}
