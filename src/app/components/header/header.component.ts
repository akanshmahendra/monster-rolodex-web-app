import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentTheme: string = 'light';
  mobileMenuOpened: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleTheme() {
    if (this.currentTheme === 'light') {
      document.body.classList.add('dark-theme');
      this.currentTheme = 'dark';
    } else {
      document.body.classList.remove('dark-theme');
      this.currentTheme = 'light';
    }
  }

  toggleMenu() {
    this.mobileMenuOpened = !this.mobileMenuOpened;
  }

}
