import { Todo, TodoMock } from "./todo";

export interface Column {
    id: number;
    name: string;
    board: number;
    todos: Todo[];
}

export const ColumnMock: Column = {
    id: 1,
    name: "To Do",
    board: 1,
    todos: [
        TodoMock
    ]
};
