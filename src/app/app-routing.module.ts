import { NgModule } from '@angular/core';
import { StarshipListComponent } from "./starship-list/starship-list.component";
import { RouterModule, Routes } from "@angular/router";
import { StarshipDetailComponent } from "./starship-detail/starship-detail.component";
import { PilotDetailComponent } from "./pilot-detail/pilot-detail.component";



const routes: Routes = [
  { path: 'starships/:name', component: StarshipDetailComponent },
  { path: 'starships', component: StarshipListComponent },
  { path: 'pilots/:name', component: PilotDetailComponent },
  { path: '**', redirectTo: '/starships'},
];

@NgModule({
            imports: [RouterModule.forRoot(routes, {scrollOffset: [0, 0], scrollPositionRestoration: 'enabled'})],
            exports: [RouterModule]
          })
export class AppRoutingModule { }
