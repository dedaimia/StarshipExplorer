import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StarshipApiService } from "../services/starship-api.service";
import { ActivatedRoute } from "@angular/router";
import { Starship, StarshipExpanded } from "../models/types";
import { SubscriptionComponent } from "../subscription-component/subscription.component";

@Component({
  selector: 'app-starship',
  templateUrl: './starship.component.html',
  styleUrls: ['./starship.component.scss']
})
export class StarshipComponent extends SubscriptionComponent implements OnInit {
  allStarshipsByName?: Map<string, StarshipExpanded>;
  starshipName?: string;
  starship?: StarshipExpanded;

  constructor(private starshipApiService: StarshipApiService, private route: ActivatedRoute) {
    super();
    this.allStarshipsByName = this.starshipApiService.getStarshipsByName();

    this.subscriptions.push(route.paramMap.subscribe(params => {
      this.starshipName = params.get('name') || undefined;
      if(this.starshipName){
       this.starship = this.allStarshipsByName.get(this.starshipName.toUpperCase());
      }

    }));
  }

  ngOnInit(): void {

  }

}
