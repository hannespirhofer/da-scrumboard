import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RouteService } from '../../../shared/route.service';
import { BoardDataService } from '../../../services/board-data.service';
import { newTodo, Todo } from '../../../interfaces/todo';
import { Router } from '@angular/router';
import { SnackService } from '../../../services/snack.service';

@Component({
  selector: 'app-new-todo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-todo.component.html',
  styleUrl: './new-todo.component.scss'
})
export class NewTodoComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private routeService: RouteService,
    private dataService: BoardDataService,
    private snack: SnackService
  ) { }

  subscriptions: Subscription[] = [];
  boardId: number|null = null;

  ngOnInit(): void {
    this.subscribeToRouteId();
    this.todoForm.valueChanges.subscribe(() => {
        console.log(this.todoForm);
    })
  }

  subscribeToRouteId() {
    // observe the url id and get the data once ready
    this.subscriptions.push(
        this.routeService.id$.subscribe((id) => {
          if (id) {
            this.boardId = id;
            this.patchBoardIdOnForm(id);
          }
        })
    );
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

  isTitleInvalid() {
    return this.todoForm.get('title')?.invalid && !this.todoForm.get('title')?.pristine;
  }

  onTodoSubmit() {
    const vals = this.todoForm.getRawValue() as newTodo;
    this.dataService.saveTodo(vals).then((res) => {
      this.snack.show('Todo saved!', 'Redirecting now.', 1500).then(() => {
        this.router.navigate(["board/", this.boardId]);
      })
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
