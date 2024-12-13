import { Todo } from "./todo";

export interface Column {
    id: number;
    name: string;
    board: number;
    todos: Todo[];
}

export const DefaultColumn: Column = {
    id: 0,
    name: "",
    board: 0,
    todos: [],
};
