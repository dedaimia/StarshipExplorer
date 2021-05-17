import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StarshipListComponent } from './starship-list/starship-list.component';
import { StarshipComponent } from './starship/starship.component';
import { FilmsComponent } from './films/films.component';
import { PilotsComponent } from './pilots/pilots.component';
import { StarshipApiService } from "./services/starship-api.service";
import { SubscriptionComponent } from './subscription-component/subscription.component';
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RocketIconComponent } from './rocket-icon/rocket-icon.component';

export const init = (starshipApiService: StarshipApiService) => () => starshipApiService.doInit();

@NgModule({
  declarations: [
    AppComponent,
    StarshipListComponent,
    StarshipComponent,
    FilmsComponent,
    PilotsComponent,
    SubscriptionComponent,
    HeaderComponent,
    FooterComponent,
    RocketIconComponent,
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
