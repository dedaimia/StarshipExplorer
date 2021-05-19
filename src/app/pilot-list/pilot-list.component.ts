import { Component, Input, OnInit } from "@angular/core";
import { Person } from "../models/types";

@Component({
             selector: 'app-pilot-list',
             templateUrl: './pilot-list.component.html',
             styleUrls: ['./pilot-list.component.scss']
           })
export class PilotListComponent {
  @Input()
  pilots: Person[] = [];

  @Input()
  embedded: boolean = false;  // is this a top-level list or embedded inside details page of another object?

  constructor() {
  }

}
