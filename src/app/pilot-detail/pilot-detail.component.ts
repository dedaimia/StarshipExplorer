import { Component, OnInit } from '@angular/core';
import { StarshipApiService } from "../services/starship-api.service";
import { ActivatedRoute } from "@angular/router";
import { SubscriptionComponent } from "../subscription-component/subscription.component";

@Component({
  selector: 'app-pilot-detail',
  templateUrl: './pilot-detail.component.html',
  styleUrls: ['./pilot-detail.component.css']
})
export class PilotDetailComponent extends SubscriptionComponent {
  pilotName?: string;

  constructor(private route: ActivatedRoute) {
    super();
    this.subscriptions.push(route.paramMap.subscribe(params => {
      this.pilotName = params.get('name') || undefined;
    }));
  }

}
