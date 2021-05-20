import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { StarshipApiService } from "../services/starship-api.service";
import { ActivatedRoute } from "@angular/router";
import { Planet, Starship, StarshipExpanded } from "../models/types";
import { SubscriptionComponent } from "../subscription-component/subscription.component";

@Component({
  selector: 'app-starship-detail',
  templateUrl: './starship-detail.component.html',
  styleUrls: ['./starship-detail.component.scss']
})
export class StarshipDetailComponent extends SubscriptionComponent implements OnInit {
  allStarshipsByName?: Map<string, StarshipExpanded>;
  allPlanetsByUrl: Map<string, Planet>;
  starshipName?: string;
  starship?: StarshipExpanded;
  loading: boolean = true;
  error: string = null;

  constructor(private starshipApiService: StarshipApiService, private route: ActivatedRoute) {
    super();
    this.starshipApiService.getAllStarshipsByName().then(starshipsByName => {
      this.allStarshipsByName = starshipsByName;
      if(this.starshipName){
        this.starship = this.allStarshipsByName.get(this.starshipName.toUpperCase());
      }
      this.checkLoading();
    }).catch(err => this.error = "Error retrieving starships");

    this.starshipApiService.getAllPlanetsByUrl().then(planetsByUrl => {
      this.allPlanetsByUrl = planetsByUrl;
      this.checkLoading();
    }).catch(err => this.error = "Error retrieving homeworlds");

    this.subscriptions.push(route.paramMap.subscribe(params => {
      this.starshipName = params.get('name') || undefined;
      if(this.starshipName && this.allStarshipsByName){
       this.starship = this.allStarshipsByName.get(this.starshipName.toUpperCase());
      }

    }));
  }

  checkLoading(){
    //we're done loading if we have both starships and planets
    if(this.allStarshipsByName && this.allPlanetsByUrl){
      this.loading = false;
    }
  }

  ngOnInit(): void {

  }

}
