import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { BoardList } from "../interfaces/board-list";
import { BoardDetail } from "../interfaces/board-detail";
import { newTodo, Todo } from "../interfaces/todo";
import { User } from "../interfaces/user";

@Injectable({
    providedIn: "root",
})
export class BoardDataService {
    url = "http://127.0.0.1:8000/api/";

    constructor(private http: HttpClient) {}

    getActiveUsers(): Observable<User[]> {
        const url = this.url + "members/";
        return this.http.get<User[]>(url);
    }

    getBoardListData(): Observable<BoardList[]> {
        const url = this.url + "boards/";
        return this.http.get<BoardList[]>(url);
    }

    getBoardData(boardid: number): Observable<BoardDetail> {
        const url = this.url + "boards/" + boardid + "/";
        return this.http.get<BoardDetail>(url);
    }

    saveTodo(todo: newTodo) {
        const url = this.url + "todos/";
        return firstValueFrom(this.http.post(url, todo));
    }

    editTodo(todo: newTodo, id: number) {
        const url = this.url + "todos/" + id + "/";
        return firstValueFrom(this.http.patch(url, todo));
    }

    deleteTodo(id: number) {
        const url = this.url + "todos/" + id + "/";
        return firstValueFrom(this.http.delete(url));
    }

    updateTodo(todo: Todo) {
        const id = todo.id;
        const url = this.url + "todos/" + id + "/";
        return firstValueFrom(this.http.patch(url, todo));
    }

    postBoard(boardName: string) {
        const url = this.url + "boards/";
        const body = {
            name: boardName,
        };
        return firstValueFrom(this.http.post(url, body));
    }
}
