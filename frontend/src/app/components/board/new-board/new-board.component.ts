import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { BoardDataService } from "../../../services/board-data.service";
import { SnackService } from "../../../services/snack.service";
import { Router } from "@angular/router";
import { UtilService } from "../../../services/util.service";
import { setThrowInvalidWriteToSignalError } from "@angular/core/primitives/signals";

@Component({
    selector: "app-new-board",
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: "./new-board.component.html",
    styleUrl: "./new-board.component.scss",
})
export class NewBoardComponent {
    constructor(
        private formBuilder: FormBuilder,
        private boardDataService: BoardDataService,
        private snack: SnackService,
        private router: Router,
        private util: UtilService
    ) {}

    newBoardForm = this.formBuilder.group({
        boardName: ["", Validators.required],
    });

    async createBoard() {
        const name = this.newBoardForm.controls.boardName.value;
        if (this.newBoardForm.valid && name) {
            const res: any = await this.boardDataService.postBoard(name);
            // Get the id and load the new board
            const boardId = res.id;
            await this.snack.show(
                `Board created wit the id ${boardId}`,
                "You will be redirected to board page.",
                1800
            );
            await this.router.navigate(["board", boardId]);
            this.util.refresh();
        }
    }
}
