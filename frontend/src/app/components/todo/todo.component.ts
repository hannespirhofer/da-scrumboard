import { CommonModule } from "@angular/common";
import { Component, Input, input } from "@angular/core";
import { TodoMock, Todo } from "../../interfaces/todo";

@Component({
    selector: "app-todo",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./todo.component.html",
    styleUrl: "./todo.component.scss",
})
export class TodoComponent {
    @Input({ required: true }) todo: Todo = TodoMock;
}
