import { CommonModule } from "@angular/common";
import { Component, Input, input, OnInit } from "@angular/core";
import { TodoMock, Todo } from "../../interfaces/todo";

@Component({
    selector: "app-todo",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./todo.component.html",
    styleUrl: "./todo.component.scss",
})
export class TodoComponent{
    @Input({ required: true }) todo: Todo = TodoMock;

    hoveredCard: number | null = null;

    log() {
        console.log(this.hoveredCard);
    }
}
