import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class BoardDataService {
    url = "http://127.0.0.1:8000/api/";

    constructor(private http: HttpClient) {}

    getBoardListData() {
        const url = this.url + "boards/";
        return lastValueFrom(this.http.get(url));
    }

    getBoardData(boardid: number) {
        const url = this.url + "boards/" + boardid + "/";
        return lastValueFrom(this.http.get(url));
    }

    postBoard(boardName: string) {
        const url = this.url + "boards/";
        const body = {
            name: boardName,
        };
        return lastValueFrom(this.http.post(url, body));
    }
}
