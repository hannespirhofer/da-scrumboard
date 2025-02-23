import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DataService } from '../../../services/shared/data.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { BoardDetail } from '../../../interfaces/board-detail';
import { BoardDataService } from '../../../services/board-data.service';
import { User } from '../../../interfaces/user';
import { SnackService } from '../../../services/snack.service';

@Component({
  selector: 'app-edit-board',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-board.component.html',
  styleUrl: './edit-board.component.scss'
})
export class EditBoardComponent implements OnInit, OnDestroy {

    private readonly route = inject(ActivatedRoute);
    board: BoardDetail | null = null;
    boardid: number | null = null;
    users: User[] = [];

    s: Subscription[] = [];

    constructor(
        private data: DataService,
        private dataService: BoardDataService,
        private snack: SnackService
    ) {}

    boardForm = new FormGroup({
        board: new FormControl({value: 123456, disabled: true}, Validators.required),
        name: new FormControl({value: '', disabled: false}, Validators.required),
    })

    onBoardSubmit() {
        let formValue = this.boardForm.getRawValue() as any;
        formValue.members = this.board?.members;
        console.log(formValue);
    }

    removeUser(id: number) {
        //if its me return
        const projectOwnerId = this.board?.owner.id;
        if (id == projectOwnerId) {
            this.snack.show("Error", "You cannot remove yourself!", 800);
            return;
        }

        if (this.board?.members && this.board.members.length > 0) {
            const i = this.board.members.findIndex(member => member.id == id);
            if (i != -1) {
                const user = this.board.members.splice(i, 1)[0];
                this.users.push(user);
            }
        }
    }

    ngOnInit(): void {
        this.s.push(
            this.route.params.subscribe({
            next: (d) => {
                if (d['id']) {
                    this.boardid = d['id'] as number;
                }
            }
        }));
        this.setOrFetchBoard();
    }

    patchForm(d: BoardDetail) {
        this.boardForm.controls['board'].setValue(d.id, {onlySelf: true});
        this.boardForm.controls['name'].setValue(d.name, {onlySelf: true});
    }

    loadUsers() {
        this.s.push(
            this.dataService.getActiveUsers().subscribe({
                next: (users) => {
                    this.cleanAndUpdateUserList(users);
                },
                error: (e) => {
                    console.error(e);
                }
            })
        );
    }

    cleanAndUpdateUserList(users: User[]) {
        const memberIds = new Set(this.board?.members.map(m => m.id));
        const filteredUsers = users.filter(user => !memberIds.has(user.id))
        this.users = filteredUsers;
    }

    addUser() {
        const userid = Number(this.boardForm.get('members')?.value)
        const idx = this.users.findIndex(u => u.id == userid)
        if (idx != -1) {
            const user = this.users.splice(idx, 1)[0];
            this.board?.members.push(user);
        }
    }

    setOrFetchBoard() {
        if (this.data.board) {
            this.board = this.data.board;
            this.patchForm(this.board);
        } else {
            // Get the data from the server
            if (this.boardid) {
                this.s.push(
                    this.dataService.getBoardData(this.boardid).subscribe({
                        next: (d) => {
                            this.board = d;
                            this.loadUsers();
                            this.patchForm(d);

                        },
                        error: (e) => {
                            console.error(e);
                        }
                    })
                );
            }
        }
    }

    ngOnDestroy(): void {
        if (this.s) {
            this.s.forEach(s => {
                s.unsubscribe();
            });
        }
    }

}
