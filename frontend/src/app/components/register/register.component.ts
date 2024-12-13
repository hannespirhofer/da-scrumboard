import { Component, OnInit } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { SnackService } from "../../services/snack.service";
import { PasswordMatchValidator } from "../../password-match.validator";

@Component({
    selector: "app-register",
    standalone: true,
    imports: [RouterLink, CommonModule, ReactiveFormsModule],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
})
export class RegisterComponent {
    submitted: Boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private snack: SnackService
    ) {}

    registerForm = this.formBuilder.group(
        {
            firstname: ["", Validators.minLength(3)],
            lastname: ["", Validators.minLength(3)],
            username: ["", [Validators.required, Validators.minLength(3)]],
            // TODO Validate to Django format otherwise we get the error after
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(4)]],
            passwordConfirm: [
                "",
                [Validators.required, Validators.minLength(4)],
            ],
        },
        { validators: PasswordMatchValidator("password", "confirmPassword") }
    );

    private mapFormValues(values: any) {
        return {
            first_name: values.firstname,
            last_name: values.lastname,
            username: values.username,
            email: values.email,
            password: values.password,
        };
    }

    async onSubmit() {
        this.submitted = true;
        if (this.registerForm.valid) {
            const formData = this.mapFormValues(this.registerForm.value);
            this.registerUser(formData);
        } else {
            console.error("Form is not valid");
        }
    }

    async registerUser(data: any) {
        try {
            let resp = await this.auth.register(data);
            this.snack.show(
                "Register successful.",
                "You will be redirected to the login page.",
                3500
            );
            this.submitted = false;
            this.registerForm.reset();
            this.router.navigateByUrl("/login");
        } catch (error) {
            console.error("An error happened: ", error);
        }
    }
}
