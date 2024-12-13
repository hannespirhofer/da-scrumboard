import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink, RouterModule } from "@angular/router";
import { BoardList } from "../../interfaces/board-list";
import { CommonModule } from "@angular/common";
import { BoardService } from "../../services/board.service";
import { Observable, Subscription } from "rxjs";
import { BoardDetail, BoardExtended } from "../../interfaces/board-detail";
import { TodoComponent } from "../todo/todo.component";
import { ColumnComponent } from "../column/column.component";
import { HeaderComponent } from "./header/header.component";
import { NoBoardComponent } from "./no-board/no-board.component";

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
        NoBoardComponent,
    ],
    templateUrl: "./board.component.html",
    styleUrl: "./board.component.scss",
})
export class BoardComponent implements OnInit, OnDestroy {
    constructor(
        private board: BoardService,
        private route: ActivatedRoute //private auth: AuthService
    ) {}

    subscription: Subscription = new Subscription();

    // The projects for the user on the sidebar
    userProjects!: Observable<BoardList[]>;

    // If one is selcted in the sidebar
    selectedProject!: Observable<BoardDetail>;

    // the param Project id from the URL
    currentProjectID: number | null = null;

    // to change view when no project has been selected
    isBoardSelected: boolean = false;

    ngOnInit(): void {
        this.board.getUserBoardList();

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.route.params.subscribe((p) => {
            const boardId = +p["id"];
            if (boardId && typeof boardId === "number") {
                this.isBoardSelected = true;
                this.currentProjectID = boardId;
                this.board.getUserBoardList();
                this.board.getBoardDetailData(boardId);
            } else {
                this.isBoardSelected = false;
            }
        });

        this.userProjects = this.board.list$;
        this.selectedProject = this.board.detail$;
    }

    // just for fun
    addMagic() {
        this.board.setBoard(BoardExtended);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    isOwner() {
        return true;
    }
}
