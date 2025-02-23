import { Component, OnInit } from '@angular/core';
import { newTodo, Todo } from '../../../interfaces/todo';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardDataService } from '../../../services/board-data.service';
import { SnackService } from '../../../services/snack.service';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-todo.component.html',
  styleUrl: './edit-todo.component.scss'
})
export class EditTodoComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: BoardDataService,
    private snack: SnackService
  ) {}

  public todo: Todo | null = null;

  ngOnInit(): void {
    const stateTodo = history.state['todo'];

      if (stateTodo) {
        this.todo = stateTodo;

        this.todoForm.patchValue({
          column: stateTodo.column,
          title: stateTodo.title,
          description: stateTodo.description,
          board: stateTodo.board
        });
      };
  }

  todoForm = new FormGroup({
    board: new FormControl({value: 123, disabled: true}, Validators.required),
    column: new FormControl({value: 1, disabled: false}, Validators.required),
    title: new FormControl({value: '', disabled: false}, [Validators.required, Validators.minLength(5)]),
    description: new FormControl()
  })

  patchBoardIdOnForm(id: number): void {
    this.todoForm.patchValue({board: id});
  }

  columns = [
    { value: 1, label: 'ToDo'},
    { value: 2, label: 'Doing'},
    { value: 3, label: 'Done'}
  ];

  onTodoEdit() {
    const vals = this.todoForm.getRawValue() as newTodo;
    const todoId = Number(this.activatedRoute.snapshot.paramMap.getAll('todoId'));
    console.log(vals, todoId);

    this.dataService.editTodo(vals, todoId).then((res) => {
      this.snack.show('Todo saved!', 'Redirecting now.', 1500).then(() => {
        this.router.navigate(["board/", 1]);
      })
    });
  }

  onTodoDelete() {
    const todoId = Number(this.activatedRoute.snapshot.paramMap.getAll('todoId'));
    const boardId = Number(this.activatedRoute.snapshot.paramMap.getAll('id'));
    if (!todoId || !boardId) {return};
    this.dataService.deleteTodo(todoId).then((res) => {
      this.snack.show('Todo deleted!', 'Redirecting now.', 1500).then(() => {
        this.router.navigate(["board/", boardId]);
      })
    });
  }
}
