import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink, RouterModule } from "@angular/router";
import { BoardList } from "../../interfaces/board-list";
import { CommonModule } from "@angular/common";
import { BoardService } from "../../services/board.service";
import { Observable, of, Subscription } from "rxjs";
import { BoardDetail } from "../../interfaces/board-detail";
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

    isOwner: Boolean = false;
    currentProjectID: number | null = null;
    isBoardSelected: boolean = false;

    userProjects: Observable<BoardList[]> = this.board.getBoardList();
    // start as an empty observable until param is ready
    selectedProject: Observable<BoardDetail> = of();

    subscription: Subscription|null = null;

    constructor(
        private board: BoardService,
        private route: ActivatedRoute //private auth: AuthService
    ) {}

    ngOnInit(): void {

        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.route.params.subscribe((p) => {
            const idparam: string = p['id'];
            const id: number = +idparam;

            if (id && typeof id === "number") {
                this.isBoardSelected = true;
                this.currentProjectID = id;
                this.selectedProject = this.board.getBoardDetail(id);
            } else {
                this.isBoardSelected = false;
            }
        });
    }

    getOwner() {
        return this.isOwner;
    }

    setOwner(val: Boolean) {
        this.isOwner = val;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
