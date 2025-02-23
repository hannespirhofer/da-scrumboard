import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { SnackService } from "../../../services/snack.service";
import { delay } from "../../../helper/delay";
import { ScriptService } from "../../../services/script.service";
import { TitleCasePipe } from '@angular/common';

@Component({
    selector: "app-header",
    standalone: true,
    imports: [TitleCasePipe],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
    public username: string | null = null;
    public email: string | null = null;

    constructor(
        private auth: AuthService,
        private router: Router,
        private snack: SnackService,
        private script: ScriptService
    ) {}

    @Input({ required: true }) title: string = "Board";

    ngOnInit(): void {
        this.getUserDetails();
        if (this.script.loadScripts) {
            this.script
                .load("jquery", "popper", "bootstrap")
                .then((data) => {
                    console.log("external scripts loaded", data);
                })
                .catch((error) => console.error("scripts not loaded", error));
        }
    }

    getUserDetails() {
        const user = this.auth.getUserData();
        this.username = user.username ?? localStorage.getItem("username");
        this.email = user.email ?? 'keine Email';
    }

    async onLogout() {
        try {
            let resp: any = await this.auth.logout();
            // Move to a utility function
            localStorage.removeItem("token");
            this.auth.currentUser = null;
            this.snack.show("Logout", resp.message, 1000);
            await delay(1000);
            this.router.navigateByUrl("/login");
        } catch (error) {
            this.snack.show(
                "Error",
                "An error occurred while logging out. Try to log in again."
            );
            console.error("An error happend: ", error);
        }
    }
}
