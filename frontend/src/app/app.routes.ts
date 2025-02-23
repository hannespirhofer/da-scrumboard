import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { BoardComponent } from "./components/board/board.component";
import { NewTodoComponent } from "./components/board/new-todo/new-todo.component";
import { NewBoardComponent } from "./components/board/new-board/new-board.component";
import { DetailComponent } from "./components/board/detail/detail.component";
import { EditTodoComponent } from "./components/board/edit-todo/edit-todo.component";
import { EditBoardComponent } from "./components/board/edit-board/edit-board.component";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "board",
        pathMatch: "full",
    },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    {
        path: "board",
        // canActivate: [authGuard],
        component: BoardComponent,
        children: [
            { path: "", redirectTo: "new", pathMatch: "full" },
            { path: "new", component: NewBoardComponent }, // New Board
            { path: ":id", component: DetailComponent }, // Detail Board
            { path: ":id/edit", component: EditBoardComponent }, // Edit Board Page
            { path: ":id/new", component: NewTodoComponent }, // New Todo on Board
            { path: ":id/edit/:todoId", component: EditTodoComponent }, // Edit Todo
        ],
    },
];
