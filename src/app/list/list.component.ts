import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input()
  items;
  @Input()
  title;

  field1: string = "gender"

  constructor() { }

  ngOnInit(): void {
  }

}
