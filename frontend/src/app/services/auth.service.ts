import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { User } from "../interfaces/user";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private http: HttpClient) {}

    currentUser: any | null = null;

    url = "http://127.0.0.1:8000/api/";

    register(payload: any) {
        const url = this.url + "register/";
        return lastValueFrom(this.http.post(url, payload));
    }

    login(payload: any) {
        const url = this.url + "login/";
        return lastValueFrom(this.http.post(url, payload));
    }

    logout() {
        const url = this.url + "logout/";
        return lastValueFrom(this.http.get(url));
    }

    public getCurrentUser(): User {
        return this.currentUser;
    }
}
