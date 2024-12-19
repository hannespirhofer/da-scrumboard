export interface Todo {
    id: number|null;
    title: string;
    description: string;
    column: number|null;
    completed: boolean;
    author: number|null;
}

export const TodoMock: Todo = {
    id: 1,
    title: "Mock Task",
    description: "This is a mock task for testing purposes",
    column: 1,
    completed: false,
    author: 1
};
