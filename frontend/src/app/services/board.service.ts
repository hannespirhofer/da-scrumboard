import { Injectable } from "@angular/core";
import { BoardDataService } from "./board-data.service";
import { Router } from "@angular/router";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class BoardService {
    constructor(private data: BoardDataService, private router: Router) {}

    getBoardDetail(boardid: number) {
        return this.data.getBoardData(boardid);
    }

    getBoardList() {
        return this.data.getBoardListData();
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
            const list = await lastValueFrom(this.getBoardList());
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
