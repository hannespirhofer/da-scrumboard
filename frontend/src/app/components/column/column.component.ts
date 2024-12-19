import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TodoComponent } from "../todo/todo.component";
import { Column, ColumnMock } from "../../interfaces/column";

@Component({
    selector: "app-column",
    standalone: true,
    imports: [CommonModule, TodoComponent],
    templateUrl: "./column.component.html",
    styleUrl: "./column.component.scss",
})
export class ColumnComponent {
    @Input({ required: true }) column: Column = ColumnMock;
}

