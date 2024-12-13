import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { SnackService } from "../../services/snack.service";
import { CommonModule } from "@angular/common";
import { delay } from "../../helper/delay";
import { BoardService } from "../../services/board.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [RouterLink, CommonModule, ReactiveFormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
})
export class LoginComponent {
    submitted: boolean = false;
    backendError = "";

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private snack: SnackService,
        private board: BoardService
    ) {}

    loginForm = this.formBuilder.group({
        username: ["", Validators.required],
        password: ["", Validators.required],
    });

    async onSubmit() {
        this.submitted = true;
        try {
            const resp: any = await this.auth.login(this.loginForm.value);
            this.onLoginSuccess(resp);
        } catch (error: any) {
            this.onLoginFailed(error);
        }
    }

    async onLoginSuccess(resp: any) {
        this.auth.currentUser = resp;
        this.snack.show(
            "Login successful.",
            "You will be redirected to board page.",
            1000
        );
        this.submitted = false;
        localStorage.setItem("token", resp.token);
        this.loginForm.reset();
        await delay(1000);
        this.board.actionAfterLogin();
    }

    onLoginFailed(error: any) {
        console.error("An error occurred: ", error);
        this.submitted = false;
        this.loginForm.reset();
        const errObj = error.error;
        const keys = Object.keys(errObj);
        const firstKey = keys[0];
        const firstKeyValue = errObj[firstKey][0];
        if (firstKeyValue) {
            this.snack.show("Error", firstKeyValue, 3500, "error");
        }
    }
}
