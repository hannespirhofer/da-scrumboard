import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { SnackService } from "../../../services/snack.service";
import { delay } from "../../../helper/delay";
import { ScriptService } from "../../../services/script.service";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
    constructor(
        private auth: AuthService,
        private router: Router,
        private snack: SnackService,
        private script: ScriptService
    ) {}

    @Input({ required: true }) title: string = "Board";

    ngOnInit(): void {
        this.script
            .load("jquery", "popper", "bootstrap")
            .then((data) => {
                console.log("external scripts loaded", data);
            })
            .catch((error) => console.error("scripts not loaded", error));
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
