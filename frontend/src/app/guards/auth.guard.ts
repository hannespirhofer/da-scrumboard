import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";

export const authGuard: CanActivateChildFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem("token");

    if (token) {
        return true;
    } else {
        router.navigate(["/login"]);
        return false;
    }
};
