import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-todo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-todo.component.html',
  styleUrl: './new-todo.component.scss'
})
export class NewTodoComponent {
  todoForm = new FormGroup({
    board: new FormControl(''),
    column: new FormControl(1),
    title: new FormControl(''),
    description: new FormControl('')
  })

  columns = [
    { value: '1', label: 'ToDo'},
    { value: '2', label: 'Doing'},
    { value: '3', label: 'Done'}
  ];

  onTodoSubmit() {
    const val = this.todoForm.value;
    console.log(val);
  }
}
