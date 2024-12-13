import { Injectable } from "@angular/core";
import { BoardList } from "../interfaces/board-list";
import { BoardDataService } from "./board-data.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { BoardDetail, BoardDetailDefault } from "../interfaces/board-detail";

@Injectable({
    providedIn: "root",
})
export class BoardService {
    constructor(private data: BoardDataService, private router: Router) {}

    // can be deeleted
    projectsList: BoardList[] = [];
    // currentProjectID!: number;
    projectDetail: any = {};

    private listSubject = new BehaviorSubject<BoardList[]>([]);
    list$ = this.listSubject.asObservable();

    private detailSubject = new BehaviorSubject<BoardDetail>(
        BoardDetailDefault
    );
    detail$ = this.detailSubject.asObservable();

    // private currentIDSubject = new BehaviorSubject<number | null>(null);
    // currentID = this.currentIDSubject.asObservable();

    // Actually not needed as sidebar data and project data fetching is seperate
    async initBoard(id: number) {
        await this.getUserBoardList();
        await this.getBoardDetailData(id);
    }

    // setCurrentId(id: number) {
    //     this.currentIDSubject.next(id);
    // }

    // just for fun
    setBoard(newBoardData: BoardDetail) {
        this.detailSubject.next(newBoardData);
    }

    async actionAfterLogin() {
        // needed otherwise we dont have any id to redirect (add new API endpoint).
        await this.getUserBoardList();
        this.loadLatestBoardOrNew();
    }

    getCurrentProjectIDByProjectsList() {
        if (Array.isArray(this.projectsList) && this.projectsList.length > 0) {
            const id = this.projectsList[0].id;
            return id;
        }
        return null;
    }

    /**
     * Fetch all the boards for the current logged in user as array
     */
    async getUserBoardList() {
        try {
            const resp = (await this.data.getBoardListData()) as BoardList[];
            this.projectsList = resp;

            this.listSubject.next(this.projectsList);
        } catch (error) {
            console.error(
                "An error occurred while fetching the current boards.",
                error
            );
        }
    }

    /**
     * Fetch the details for a selected board including todos and columns
     * @param id The id of the board to fetch the data from
     */
    async getBoardDetailData(id: number) {
        try {
            const resp = (await this.data.getBoardData(id)) as BoardDetail;
            // console.log("BoardService - getBoardDetailData response:", resp);
            console.log(resp);

            this.projectDetail = resp;
            this.detailSubject.next(resp);
        } catch (error) {
            this.loadLatestBoardOrNew();
            console.error("BoardService - getBoardDetailData error:", error);
        }
    }

    async loadLatestBoardOrNew() {
        const lastProjectId = this.getCurrentProjectIDByProjectsList();
        if (lastProjectId) {
            //this.currentIDSubject.next(lastProjectId);
            this.getBoardDetailData(lastProjectId);
            this.router.navigate(["board/", lastProjectId]);
        } else {
            this.router.navigateByUrl("board/new");
        }
    }
}
