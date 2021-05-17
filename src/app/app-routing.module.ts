import { NgModule } from '@angular/core';
import { StarshipListComponent } from "./starship-list/starship-list.component";
import { RouterModule, Routes } from "@angular/router";
import { StarshipComponent } from "./starship/starship.component";



const routes: Routes = [
  { path: 'starships/:name', component: StarshipComponent },
  { path: 'starships', component: StarshipListComponent },
  { path: '**', redirectTo: '/starships'},
];

@NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
          })
export class AppRoutingModule { }
