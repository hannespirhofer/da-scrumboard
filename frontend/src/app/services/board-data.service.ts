import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom, Observable } from "rxjs";
import { BoardList } from "../interfaces/board-list";
import { BoardDetail } from "../interfaces/board-detail";

@Injectable({
    providedIn: "root",
})
export class BoardDataService {
    url = "http://127.0.0.1:8000/api/";

    constructor(private http: HttpClient) {}

    getBoardListData(): Observable<BoardList[]> {
        const url = this.url + "boards/";
        return this.http.get<BoardList[]>(url);
    }

    getBoardData(boardid: number): Observable<BoardDetail> {
        const url = this.url + "boards/" + boardid + "/";
        return this.http.get<BoardDetail>(url);
    }

    postBoard(boardName: string) {
        const url = this.url + "boards/";
        const body = {
            name: boardName,
        };
        return lastValueFrom(this.http.post(url, body));
    }
}
