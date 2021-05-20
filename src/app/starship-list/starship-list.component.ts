import { Component, OnInit } from "@angular/core";
import { StarshipApiService } from "../services/starship-api.service";
import { Starship, StarshipExpanded, SwapiPage } from "../models/types";
import { SubscriptionComponent } from "../subscription-component/subscription.component";
import { take } from "rxjs/operators";
import { Router } from "@angular/router";
import { search } from "@mayoclinic/icons/dist";



@Component({
  selector: 'app-starship-list',
  templateUrl: './starship-list.component.html',
  styleUrls: ['./starship-list.component.scss']
})
export class StarshipListComponent extends SubscriptionComponent implements OnInit {
  searchTerm: string = '';
  starships: StarshipExpanded[] = [];
  filteredStarships: StarshipExpanded[] = [];
  loading: boolean = true;
  error: string = null;


  constructor( private starshipApiService: StarshipApiService, private router: Router) {
    super();

    this.starshipApiService.getAllStarshipsExpanded().then(starships => {
      this.starships = starships
      this.filteredStarships = this.starships;
      this.loading = false;
      this.error = null;
    }).catch(err => this.error = "Error retrieving starships");

    // Todo: add routing support so can call page with search term in url?
  }

  ngOnInit(): void {

  }

  doSearch(searchTerm: string) {
    if (!searchTerm) {
      this.filteredStarships = this.starships;
    }
    else {
      const searchLowerCase = searchTerm.toLowerCase().trim();
      this.filteredStarships = this.starships.filter(starship =>
                                                       starship.name.toLowerCase().includes(searchLowerCase) ||
                                                       this.pilotSearch(searchLowerCase, starship)
      );

    }
  }

  pilotSearch(searchLowerCase: string, starship: StarshipExpanded ):boolean{
      return starship.pilotsO && starship.pilotsO.filter(pilot => pilot.name.toLowerCase().includes(searchLowerCase)).length > 0;
  }

}
