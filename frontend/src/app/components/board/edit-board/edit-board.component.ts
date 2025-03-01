import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DataService } from '../../../services/shared/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { BoardDetail } from '../../../interfaces/board-detail';
import { BoardDataService } from '../../../services/board-data.service';
import { User } from '../../../interfaces/user';
import { SnackService } from '../../../services/snack.service';
import { BoardService } from '../../../services/board.service';
import { UtilService } from '../../../services/util.service';

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
    initialMembers: User[] = [];
    membersChanged: boolean = false;

    s: Subscription[] = [];

    constructor(
        private data: DataService,
        private bs: BoardService,
        private dataService: BoardDataService,
        private snack: SnackService,
        private router: Router
    ) {}

    boardForm = new FormGroup({
        boardid: new FormControl({value: 123456, disabled: true}, Validators.required),
        members: new FormControl({value: '', disabled: false}, Validators.required),
        name: new FormControl({value: '', disabled: false},[Validators.required, Validators.minLength(5)]),
    })

    ngOnInit(): void {
        const sub = this.route.params.subscribe({
            next: (d) => {
                if (d['id']) {
                    this.boardid = d['id'] as number;
                }
            }
        });
        if (sub) this.s.push(sub);
        this.setOrFetchBoard();
    }

    /**
     * checks if there is any data and if null it fetches from board
     */
    setOrFetchBoard() {
        const sub = this.data.boardDetail$.subscribe({
            next: (d) => {
                if (d) {
                    this.board = d;
                    this.initBoardExtras();
                } else {
                    if (this.boardid) {
                        this.data.fetchBoardDetail(this.boardid)
                    }
                }
            },
            error: () => {
                console.error('Error fetching board data.');
            }
        })
        this.s.push(sub);
    }

    /**
     * when board data is ready, patch the form, load the users for the form select and set init members array
     */
    initBoardExtras() {
        if (this.board) {
            this.patchForm(this.board);
            this.loadUsers();
            this.initialMembers = this.board.members;
        }
    }

    fetchBoard() {
        if (this.boardid) {
            this.s.push(
                this.dataService.getBoardData(this.boardid).subscribe({
                    next: (d) => {
                        this.board = d;
                        this.initBoardExtras();
                    },
                    error: (e) => {
                        console.error(e);
                    }
                })
            );
        }
    }

    async onBoardSubmit() {
        console.log(this.boardForm.valid);

        if (!this.board) return;
        const name = this.boardForm.get('name')?.value ?? '';
        const data = this.getBoardBody(name, this.board.id);

        try {
            const res = await this.bs.setBoardDetail(data, this.board.id);
            this.data.fetchBoardList();
            await this.snack.show('Success! &#128640;', 'Board updated', 1400);
            this.router.navigate(['board', this.board.id]);
        } catch (e) {
            console.warn('Error: ', e);
        }
    }

    getBoardBody(name: string, id: number) {
        const memberIds = this.board?.members.map((m) => m.id);
        const ownerid = this.board?.owner.id ?? null;
        const obj = {
            "owner": ownerid,
            "name": name,
            "members": memberIds,
        }
        return obj;
    }

    removeUser(id: number) {
        //if its me return
        const projectOwnerId = this.board?.owner.id;
        if (id == projectOwnerId) {
            this.snack.show("Error", "You cannot remove yourself!");
            return;
        }

        if (this.board?.members && this.board.members.length > 0) {
            const i = this.board.members.findIndex(member => member.id == id);
            if (i != -1) {
                const user = this.board.members.splice(i, 1)[0];
                this.users.push(user);
                this.membersChanged = true;
            }
        }
    }

    patchForm(d: BoardDetail) {
        this.boardForm.controls['boardid'].setValue(d.id, {onlySelf: true});
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
        if (!userid) return;

        const idx = this.users.findIndex(u => u.id == userid)
        if (idx != -1) {
            const user = this.users.splice(idx, 1)[0];
            this.board?.members.push(user);
            this.membersChanged = true;
        }
    }

    isSubmitDisabled(): boolean {
        return !this.boardForm.get("name")?.valid || !(this.boardForm.dirty || this.membersChanged);
    }

    ngOnDestroy(): void {
        if (this.s) {
            this.s.forEach(s => {
                s.unsubscribe();
            });
        }
    }

}
