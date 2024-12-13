import { Column } from "./column";
import { User } from "./user";

export interface BoardDetail {
    id: number;
    owner: User;
    members: User[];
    columns: Column[];
    name: string;
}

export const BoardDetailDefault: BoardDetail = {
    id: 0,
    name: "",
    owner: {
        id: 0,
        username: "",
        first_name: "",
        last_name: "",
    },
    members: [],
    columns: [],
};

export const BoardExtended: BoardDetail = {
    id: 1,
    owner: {
        id: 18,
        username: "maxi",
        first_name: "",
        last_name: "",
    },
    members: [
        {
            id: 1,
            username: "hannes",
            first_name: "",
            last_name: "",
        },
    ],
    columns: [
        {
            id: 1,
            name: "To Do",
            board: 1,
            todos: [
                {
                    id: 1,
                    title: "Add API Views for the models",
                    description: "Get, Post",
                    column: 1,
                    completed: false,
                    author: 1,
                },
                {
                    id: 2,
                    title: "Implement data into frontend",
                    description: "",
                    column: 1,
                    completed: false,
                    author: 1,
                },
                {
                    id: 3,
                    title: "Create drag and drop logic",
                    description: "angular material library",
                    column: 1,
                    completed: false,
                    author: 1,
                },
            ],
        },
        {
            id: 2,
            name: "Doing",
            board: 1,
            todos: [
                {
                    id: 4,
                    title: "Review API documentation",
                    description: "Ensure all endpoints are documented",
                    column: 2,
                    completed: false,
                    author: 1,
                },
            ],
        },
        {
            id: 3,
            name: "Done",
            board: 1,
            todos: [],
        },
        {
            id: 4,
            name: "Backlog",
            board: 1,
            todos: [],
        },
    ],
    name: "Django Board",
};
