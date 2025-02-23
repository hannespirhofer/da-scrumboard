import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { firstValueFrom, Observable, take } from "rxjs";

import { Todo } from "../interfaces/todo";
import { BoardDataService } from "./board-data.service";
import { BoardDetail } from "../interfaces/board-detail";
import { DataService } from "./shared/data.service";
import { BoardList } from "../interfaces/board-list";

@Injectable({
    providedIn: "root",
})
export class BoardService {
    constructor(
        private data: BoardDataService,
        private router: Router,
        private boarddata: DataService,
    ) {}

    getBoardDetail(boardid: number) {
        const res = this.data.getBoardData(boardid);
        this.validateRequestAndSave(res);
        return res;
    }

    getBoardList() {
        const res = this.data.getBoardListData();
        this.validateRequestAndSave(res);
        return res;
    }

    /**
     *
     * @param res Http Observable
     */
    validateRequestAndSave(res: Observable<BoardDetail|BoardList[]>) {
        res.subscribe({
            next: (data) => {
                if (this.isBoardDetail(data)) {
                    this.boarddata.board = data as BoardDetail;
                } else {
                    this.boarddata.boardlist = data as BoardList[];
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    /**
     * Checks if the data is of Type BoardList or BoardDetail.
     * @param data request response object.
     * @returns boolen if is_owner is set
     */
    isBoardDetail(data: any): Boolean {
        return data.is_owner ? true : false;
    }



    updateItem(item: Todo) {
        return this.data.updateTodo(item);
    }

    actionAfterLogin() {
        this.loadLatestBoardOrNew();
    }

    async loadLatestBoardOrNew() {
        const lastProjectId = await this.getCurrentProjectIDByProjectsList();
        if (lastProjectId) {
            this.router.navigate(["board/", lastProjectId]);
        } else {
            this.router.navigateByUrl("board/new");
        }
    }

    async getCurrentProjectIDByProjectsList():Promise<number|null> {
        try {
            const list = await firstValueFrom(this.getBoardList());
            if (list && list.length > 0) {
                const id = list[0].id;
                if (id && typeof(id) == 'number') {
                    return id
                }
            }
            return null;
        } catch (error) {
            return null;
        }

    }
}
