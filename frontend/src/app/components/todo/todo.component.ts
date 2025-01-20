import { CommonModule } from "@angular/common";
import { Component, Input, input, OnInit } from "@angular/core";
import { TodoMock, Todo } from "../../interfaces/todo";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
    selector: "app-todo",
    standalone: true,
    imports: [
        CommonModule,
        RouterLink
    ],
    templateUrl: "./todo.component.html",
    styleUrl: "./todo.component.scss",
})
export class TodoComponent{
    @Input({ required: true }) todo: Todo = TodoMock;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    hoveredCard: number | null = null;

    onEditTodo(todo: Todo): void {
        this.router.navigate(["edit", todo.id], {
            relativeTo: this.activatedRoute,
            state: { todo : todo }
        })
    }
}
