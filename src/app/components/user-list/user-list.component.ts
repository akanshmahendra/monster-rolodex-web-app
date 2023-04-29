import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class UserListComponent implements OnInit {

  filteredUsers: User[] = [];
  allUserList: User[];

  constructor(private userService: UserService, public sideBarService: SideBarService) { }

  ngOnInit(): void {
    this.userService.fetchUsers().subscribe(userList => {
      this.allUserList = [...userList];
      this.filteredUsers = [...userList];
    });
  }

  filterUsers(eventStr: string) {
    this.filteredUsers = this.allUserList.filter(user => user.firstName.includes(eventStr));
  }

  openUserSideBar(userId: number) {
    const userData = this.filteredUsers.find(user => user.id === userId);
    this.sideBarService.open(UserInfoComponent, { panelClass: 'container-width-one', data: { user: userData } });
  }

}
