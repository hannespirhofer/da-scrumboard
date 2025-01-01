import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { CdkDrag } from "@angular/cdk/drag-drop";
import { TodoComponent } from "../../todo/todo.component";
import { SortPipe } from "../../../pipes/sort.pipe";
import { Column, ColumnMock } from "../../../interfaces/column";

@Component({
    selector: "app-column",
    standalone: true,
    imports: [CommonModule, TodoComponent, CdkDrag, SortPipe],
    templateUrl: "./column.component.html",
    styleUrl: "./column.component.scss",
})
export class ColumnComponent {
    @Input({ required: true }) column: Column = ColumnMock;
}

