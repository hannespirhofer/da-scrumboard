import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function PasswordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const passControl = control.get("password");
        const passConfControl = control.get("passwordConfirm");

        if (!passControl || !passConfControl) {
            return null;
        }

        const match = passControl.value === passConfControl.value;

        return match ? null : { passwordMismatch: true };
    };
}
