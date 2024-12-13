export interface Todo {
    id: number;
    title: string;
    description: string;
    column: number;
    completed: boolean;
    author: number;
}

export const DefaultTodo: Todo = {
    id: 0,
    title: "",
    description: "",
    column: 0,
    completed: false,
    author: 0,
};
