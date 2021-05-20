import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StarshipListComponent } from './starship-list/starship-list.component';
import { StarshipDetailComponent } from './starship-detail/starship-detail.component';
import { StarshipApiService } from "./services/starship-api.service";
import { SubscriptionComponent } from './subscription-component/subscription.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RocketIconComponent } from './rocket-icon/rocket-icon.component';
import { PilotListComponent } from './pilot-list/pilot-list.component';
import { FilmListComponent } from './film-list/film-list.component';
import { PilotDetailComponent } from './pilot-detail/pilot-detail.component';
import { PilotSummaryComponent } from './pilot-summary/pilot-summary.component';

export const init = (starshipApiService: StarshipApiService) => () => starshipApiService.doInit();

@NgModule({
  declarations: [
    AppComponent,
    StarshipListComponent,
    StarshipDetailComponent,
    SubscriptionComponent,
    HeaderComponent,
    FooterComponent,
    RocketIconComponent,
    PilotListComponent,
    FilmListComponent,
    PilotDetailComponent,
    PilotSummaryComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StarshipApiService,
    { provide: APP_INITIALIZER, useFactory: init, deps: [StarshipApiService, HttpClientModule], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
