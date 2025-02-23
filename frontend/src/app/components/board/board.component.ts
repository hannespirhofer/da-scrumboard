import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink, RouterModule } from "@angular/router";
import { BoardList } from "../../interfaces/board-list";
import { CommonModule } from "@angular/common";
import { BoardService } from "../../services/board.service";
import { Subscription } from "rxjs";
import { TodoComponent } from "../todo/todo.component";
import { HeaderComponent } from "./header/header.component";
import {
    CdkDropList,
    CdkDropListGroup,
  } from '@angular/cdk/drag-drop';
import { ColumnComponent } from "./column/column.component";
import { NewBoardComponent } from "./new-board/new-board.component";
import { RouteService } from "../../shared/route.service";
import { DataService } from "../../services/shared/data.service";

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

    userProjects: BoardList[] | null = null;
    subscriptions: Subscription[] = [];
    currentProjectID: number|null = null;

    constructor(
        private board: BoardService,
        private routeService: RouteService,
        private data: DataService
    ) {}

    ngOnInit(): void {
        // Load the boards list
        // this.setBoardList();
        this.setBoardList();
        this.subscribeToRouteId();
    }

    subscribeToRouteId() {
        this.subscriptions.push(
            this.routeService.id$.subscribe((id) => {
                this.currentProjectID = id;
            })
        );
    }

    setBoardList() {
        if (this.data.boardlist) {
            this.userProjects = this.data.boardlist;
            return;
        }
        this.subscriptions.push(
            this.board.getBoardList().subscribe({
                next: (list) => {
                    this.userProjects = list
                }
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
