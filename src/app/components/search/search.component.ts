import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  queryStr: FormControl;
  @Output() searchStr = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.queryStr = new FormControl('');
    this.queryStr.valueChanges.subscribe(elVal => {
      this.searchStr.emit(elVal ? elVal : '');
    })
  }

}
