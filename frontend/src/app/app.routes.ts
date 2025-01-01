import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { BoardComponent } from "./components/board/board.component";
import { NewTodoComponent } from "./components/board/new-todo/new-todo.component";
import { NewBoardComponent } from "./components/board/new-board/new-board.component";
import { DetailComponent } from "./components/board/detail/detail.component";

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
            { path: "new", component: NewBoardComponent },
            { path: ":id", component: DetailComponent },
            { path: ":id/new", component: NewTodoComponent }
        ],
    },
];
