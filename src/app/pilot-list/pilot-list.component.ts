import { Component, Input, OnInit } from "@angular/core";
import { Person, Planet } from "../models/types";

@Component({
             selector: 'app-pilot-list',
             templateUrl: './pilot-list.component.html',
             styleUrls: ['./pilot-list.component.scss']
           })
export class PilotListComponent {
  @Input()
  pilots: Person[] = [];

  @Input()
  planetsByUrl: Map<string, Planet>;

  @Input()
  embedded: boolean = false;  // is this a top-level list or embedded inside details page of another object?

  constructor() {
  }

}
