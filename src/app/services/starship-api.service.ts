import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Film, Person, Planet, Starship, StarshipExpanded, SwapiPage } from "../models/types";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StarshipApiService {
  private baseUri: string = "https://swapi.dev/api";  // todo: in a real app, make configurable
  private starshipsUri: string = `${this.baseUri}/starships` ;
  private peopleUri: string = `${this.baseUri}/people`;
  private filmsUri: string = `${this.baseUri}/films`;
  private planetsUri: string = `${this.baseUri}/planets`;
  private maxPages: number = 1000; // so can load for testing without waiting for all data

  private starships: Starship[] = [];
  private people: Person[] = [];
  private peopleMap: Map<string, Person> = new Map();
  private films: Film[] = [];
  private filmsMap: Map<string, Film> = new Map();
  private planets: Planet[] = [];
  private planetsMap: Map<string, Planet> = new Map();

  private starshipsExpanded: StarshipExpanded[] = [];
  private starshipsExpandedByName: Map<string, StarshipExpanded> = new Map;

  constructor(
    private httpClient: HttpClient,
  ) {
  }


  /**
   * Called by angular APP_INITIAlIZATION, in case we want to make sure any of the API data is loaded before first angular component
   * I had getAllStarshipsExpanded in here - decided it looked better to users to call from starship-list component and have
   * loading spinner there.
   */
  async doInit(){

  }

  /**
   * Get all the starships, pilots, and films and build them into a data tree.
   * The Star Wars API is paged, but our design is not, and also our design calls for searching on different fields than the API search fields, so,
   * since this is a small data set, going to load all starships, pilots, and films into memory in the UI and search on our objects in memory rather than
   * calling API search.  If this were a larger data set, or we controlled the API, would make a request to API developers to change their search, and
   * enable paging/infinite scroll in our UI.
   */
  public async getAllStarshipsExpanded(): Promise<StarshipExpanded[]>{
    // Get the starships (and associated objects) if we haven't already
    if(this.starshipsExpanded.length == 0) {
      const starshipPromise = this.getAllStarships();
      const peoplePromise = this.getAllPeople();
      const filmsPromise = this.getAllFilms();

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
    // return starships (from this or saved from previous call
    return this.starshipsExpanded;
  }

  /**
   * Get Starships mapped by id with their pilots and films filled in by objects (rather than Urls)
   * Retrieves from SWAPI if this has not already been done, otherwise returns cached copy.
   */
  public async getAllStarshipsByName(): Promise<Map<string, StarshipExpanded>>{
    await this.getAllStarshipsExpanded();
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
  private getPage(url: string): Observable<SwapiPage> {
    return this.httpClient
      .get<SwapiPage>(url.toString())
      .pipe(catchError(error => this.handleError(error, `getPage ${url}`)));

  }

  /**
   * Gets all starships from all pages of the Star Wars API
   * or cached copy if already retrieved.
   */
  public async getAllStarships(): Promise<Starship[]>{
    if(this.starships.length == 0) {
      let currentPage: SwapiPage = {next: this.starshipsUri, previous: undefined, count: 0, results: []};
      let pages = 0;
      while (currentPage.next && pages < this.maxPages) {
        pages++;
        currentPage = await this.getPage(currentPage.next).toPromise();
        this.starships = this.starships.concat(currentPage.results as Starship[]);
      }
    }
    return this.starships;
  }


  /**
   * Gets all people from all pages of the Star Wars API
   * or cached copy if already retrieved.
   */
  public async getAllPeople(): Promise<Person[]>{
    if(this.people.length == 0) {
      let currentPage: SwapiPage = {next: this.peopleUri, previous: undefined, count: 0, results: []};

      let pages = 0;
      while (currentPage.next && pages < this.maxPages) {
        pages++;
        currentPage = await this.getPage(currentPage.next).toPromise();
        this.people = this.people.concat(currentPage.results as Person[]);
      }

      // also add people to map by url
      this.people.forEach(person => {
        this.peopleMap.set(person.url, person);
      })
    }
    return this.people;

  }

  /**
   * Gets all films from all pages of the Star Wars API,
   * or cached copy if already retrieved.
   */
  public async getAllFilms(): Promise<Film[]> {
    if(this.films.length == 0) {
      let currentPage: SwapiPage = {next: this.filmsUri, previous: undefined, count: 0, results: []};
      let pages = 0;
      while (currentPage.next && pages < this.maxPages) {
        pages++;
        currentPage = await this.getPage(currentPage.next).toPromise();
        this.films = this.films.concat(currentPage.results as Film[]);
      }

      // also add films to map by url
      this.films.forEach(film => {
        this.filmsMap.set(film.url, film);
      })
    }
    return this.films;
  }


  /**
   * Gets all planets from all pages of the Star Wars API,
   * or cached copy if already retrieved.
   */
  public async getAllPlanets(): Promise<Planet[]> {
    if(this.planets.length == 0) {
      let currentPage: SwapiPage = {next: this.planetsUri, previous: undefined, count: 0, results: []};
      let pages = 0;
      while (currentPage.next && pages < this.maxPages) {
        pages++;
        currentPage = await this.getPage(currentPage.next).toPromise();
        this.planets = this.planets.concat(currentPage.results as Planet[]);
      }

      // also add planets to map by url
      this.planets.forEach(film => {
        this.planetsMap.set(film.url, film);
      })
    }
    return this.planets;
  }

  /**
   * Gets all planets from all pages of the Star Wars API,
   * or cached copy if already retrieved.
   */
  public async getAllPlanetsByUrl(): Promise<Map<string, Planet>> {
    if(this.planets.length == 0) {
      await this.getAllPlanets();
    }
    return this.planetsMap;
  }


  private handleError(error: HttpErrorResponse, method: string) {

    // Todo: in a real app set error in store/central error service.  In this test app, just log it and re-throw
    console.error(`Starship api service: error in ${method}.  ${error.message}`);

    return throwError(error);

  }
}
