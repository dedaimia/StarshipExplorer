
export interface SwapiPage{
  count: number;
  next?: string;
  previous?: string;
  results: SwapiObject[];
}

export interface SwapiObject {
  created: string;
  edited: string;
  url: string;
}

export interface Starship extends SwapiObject{
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;  // this and several other fields appear to be numbers; but API says they are strings; so respecting it's types.
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  created: string; // not displaying or using for sorting on the UI; so not converting to a date type
  edited: string;
  url: string;
}

export interface StarshipExpanded extends Starship{
  id: string;
  pilotsO: Person[];
  filmsO: Film[];
}

export interface Person extends SwapiObject{
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[]
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Film extends SwapiObject{
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string; // e.g. 1977-05-25
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}

export interface Planet extends SwapiObject{
  name: string;
  diameter: number;
  rotation_period: string;
  orbital_period: string;
  gravity: string;
  population: string;
  climate: string;
  terrain: string;
  surface_water: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string
}
