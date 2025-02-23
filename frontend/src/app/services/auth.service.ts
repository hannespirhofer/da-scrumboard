import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, lastValueFrom, Observable } from "rxjs";
import { User } from "../interfaces/user";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    private username: string|null = null;
    private email: string|null = null;

    constructor(private http: HttpClient) {}

    currentUser: any | null = null;

    url = "http://127.0.0.1:8000/api/";

    setUserData(username: string, email: string) {
        this.username = username;
        this.email = email;
    }

    getUserData() {
        return {
            "username": this.username,
            "email": this.email
        }
    }

    register(payload: any): Observable<any> {
        const url = this.url + "register/";
        return this.http.post(url, payload);
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
