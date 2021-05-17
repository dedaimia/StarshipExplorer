import { Component, Input, OnInit } from '@angular/core';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rocket-icon',
  templateUrl: './rocket-icon.component.html',
  styleUrls: ['./rocket-icon.component.scss']
})
export class RocketIconComponent implements OnInit {
  faRocket = faRocket;

  constructor() { }

  ngOnInit(): void {
  }

}
