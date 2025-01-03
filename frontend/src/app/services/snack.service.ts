import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class SnackService {
    constructor() {}

    show(title: string, text: string, duration: number = 6000, type?: string): Promise<void> {
        return new Promise((resolve) => {
            const snackContainer = document.createElement("div");
            snackContainer.className = `custom-snackbar`;

            snackContainer.innerHTML = `
                <div class="toast show" role="alert">
                <div class="toast-header">
                    <strong class="mr-auto ${
                        type === "error" ? "toast-error" : ""
                    }">${title}</strong>
                    <button type="button" class="ml-2 mb-1 close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                    ${text}
                </div>
                </div>
            `;

            document.body.appendChild(snackContainer);

            setTimeout(() => {
                document.body.removeChild(snackContainer);
                resolve();
            }, duration);
        });
    }
}
