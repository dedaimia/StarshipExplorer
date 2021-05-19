import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Film, Person, Starship, StarshipExpanded, SwapiPage } from "../models/types";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StarshipApiService {
  private baseUri: string = "https://swapi.dev/api";  // todo: in a real app, make configurable
  private starshipsUri: string = `${this.baseUri}/starships` ;
  private peopleUri: string = `${this.baseUri}/people`;
  private filmsUri: string = `${this.baseUri}/films`;
  private maxPages: number = 2;

  private starships: Starship[] = [];
  private people: Person[] = [];
  private peopleMap: Map<string, Person> = new Map();
  private films: Film[] = [];
  private filmsMap: Map<string, Film> = new Map();

  private starshipsExpanded: StarshipExpanded[] = [];
  private starshipsExpandedByName: Map<string, StarshipExpanded> = new Map;

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  /**
   * Get all the starships, pilots, and films and build them into a data tree.
   * The Star Wars API is paged, but our design is not, and also our design calls for searching on different fields than the API search fields, so,
   * since this is a small data set, going to load all starships, pilots, and films into memory in the UI and search on our objects in memory rather than
   * calling API search.  If this were a larger data set, or we controlled the API, would make a request to API developers to change their search, and
   * enable paging/infinite scroll in our UI.
   *
   * This function is called by angular app initialization, so we can be sure it's done and all data is loaded before components load.
   */
  async doInit(){
    const starshipPromise = this.getAllStarships();
    const peoplePromise = this.getAllPeople();
    const filmsPromise = this.getAllPeople();

    await Promise.all([starshipPromise, peoplePromise, filmsPromise]);

    // now that we have all objects, build the "expanded" starships array and map (by name) and all the people and film details.
    this.starships.forEach(starship => {
      const starshipExpanded: StarshipExpanded = {
        ...starship,
        filmsO: [],
        pilotsO: [],
        id: this.starshipIdFromUrl(starship.url)
      };
      starshipExpanded.films.forEach(filmUrl => {
        const filmObject:Film = this.filmsMap.get(filmUrl);
        if (filmObject) {
          starshipExpanded.filmsO.push(filmObject);
        }
      });
      starshipExpanded.pilots.forEach(pilotUrl => {
        const pilotObject:Person = this.peopleMap.get(pilotUrl);
        if (pilotObject) {
          starshipExpanded.pilotsO.push(pilotObject);
        }
      });

      this.starshipsExpanded.push(starshipExpanded);
      this.starshipsExpandedByName.set(starshipExpanded.name.toUpperCase(), starshipExpanded);
    });
  }

  /**
   * Get Starships from list loaded on app init, with their pilots and films filled in by objects (rather than Urls)
   */
  public getStarships(): StarshipExpanded[]{
    return this.starshipsExpanded;
  }

  /**
   * Get Starships mapped by id,loaded on app init, with their pilots and films filled in by objects (rather than Urls)
   */
  public getStarshipsByName(): Map<string, StarshipExpanded>{
    return this.starshipsExpandedByName;
  }


  /**
   * Helper function to get a starship id out of URL, since the Star Wars API annoyingly does not provide an ID field
   */
  starshipIdFromUrl(starshipUrl: string){
    const res = starshipUrl.match(/\/starships\/(\d+)/);
    return res && res.length > 0 ? res[1] : starshipUrl;
  }

  /**
   * Get a single page of any type of SWAPI object, from the provided url
   * @param url
   */
  getPage(url: string): Observable<SwapiPage> {
    return this.httpClient
      .get<SwapiPage>(url.toString())
      .pipe(catchError(error => this.handleError(error, `getPage ${url}`)));

  }

  /**
   * Gets all starships from all pages of the Star Wars API
   */
  private async getAllStarships(){
    let currentPage: SwapiPage = { next: this.starshipsUri, previous: undefined, count: 0, results: []};
    let pages = 0;
    while(currentPage.next && pages < this.maxPages){
      pages++;
      currentPage = await this.getPage(currentPage.next).toPromise();
      this.starships = this.starships.concat(currentPage.results as Starship[]);
    }
  }


  /**
   * Gets all people from all pages of the Star Wars API
   * @private
   */
  private async getAllPeople(){
    let currentPage: SwapiPage = { next: this.peopleUri, previous: undefined, count: 0, results: []};
    let pages = 0;
    while(currentPage.next && pages < this.maxPages){
      pages++;
      currentPage = await this.getPage(currentPage.next).toPromise();
      this.people = this.people.concat(currentPage.results as Person[]);
    }

    // also add people to map by url
    this.people.forEach(person => {
      this.peopleMap.set(person.url, person);
    })

  }

  /**
   * Gets all films from all pages of the Star Wars API
   * @private
   */
  private async getAllFilms() {
    let currentPage: SwapiPage = {next: this.filmsUri, previous: undefined, count: 0, results: []};
    let pages = 0;
    while (currentPage.next && pages < this.maxPages) {
      pages++;
      currentPage = await this.getPage(currentPage.next).toPromise();
      this.films = this.films.concat(currentPage.results as Film[]);
    }

    // also add films to map by id
    this.films.forEach(film => {
      this.filmsMap.set(film.url, film);
    })
  }


  private handleError(error: HttpErrorResponse, method: string) {

    // Todo: in a real app set error in store/central error service.  In this test app, just log it and re-throw
    console.error(`Starship api service: error in ${method}.  ${error.message}`);

    return throwError(error);

  }
}
