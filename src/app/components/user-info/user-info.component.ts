import { Component, Inject, Input, OnInit } from '@angular/core';
import { USER_DATA, User } from '../../models/user';
import { SideBarRef } from '../../utils/side-bar-ref';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  constructor(@Inject(USER_DATA) public user: User) {}

  ngOnInit(): void {
    console.log(this.user);
  }

}
