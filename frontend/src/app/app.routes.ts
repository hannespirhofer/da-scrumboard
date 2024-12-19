import { Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { BoardComponent } from "./components/board/board.component";
import { NewBoardComponent } from "./components/new-board/new-board.component";

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
        // TODO /board points to a blank page
        children: [
            { path: "", component: BoardComponent },
            { path: ":id", component: BoardComponent },
            { path: "new", component: NewBoardComponent },
        ],
    },
];
