export interface Todo {
    id: number|null;
    title: string;
    description: string;
    column: number|null;
    completed: boolean;
    author: number|null;
    order: number;
}

export interface newTodo {
    title: string;
    description: string;
    column: number|null;
    board: number;
}

export const TodoMock: Todo = {
    id: 1,
    title: "Mock Task",
    description: "This is a mock task for testing purposes",
    column: 1,
    completed: false,
    author: 1,
    order: 0,
};
