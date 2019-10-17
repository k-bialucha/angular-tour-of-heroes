import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';

import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = 'https://angular-udemy-course-backend.firebaseio.com';
const BASE_PATH = 'heroes';

const createEndpointPath = (pathsHierarchy: string[] = []) => {
  const paths = [BASE_PATH, ...pathsHierarchy];

  const pathsMerged = paths.reduce((currentPath, nextPath) => {
    return currentPath + '/' + nextPath;
  }, '');

  return `${API_URL}${pathsMerged}.json`;
};

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private _httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');

    const endpointPath = createEndpointPath();

    return this.httpClient.get<{ [key: string]: Hero }>(endpointPath).pipe(
      map(responseData => {
        const heroIds = Object.keys(responseData);

        const heroes = heroIds.map(id => ({
          ...responseData[id],
          id,
        }));

        return heroes;
      }),
      tap(_ => {
        console.log('sth', _);
      }),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: string): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero with ID=${id}`);

    // return this.httpClient.get<Hero>(ENDPOINT_URL+ ???);
    return this.getHeroes().pipe(
      map(heroesList => {
        const hero: Hero = heroesList.find(hero => hero.id === id);

        return hero;
      }),
      tap(_ => {
        console.log(`fetched hero with ID="${id}"`);
      }),
      catchError(this.handleError<Hero>(`getHero id="${id}"`))
    );
  }

  createHero(name: string): Observable<{ [key: string]: string }> {
    const endpointPath = createEndpointPath();

    const newHero = {
      name,
    };

    return this.httpClient
      .post<{ [key: string]: string }>(endpointPath, newHero)
      .pipe(
        tap(data => {
          this.log(`CREATED new hero: ${data.name}`);
        }),
        catchError(this.handleError<{ [key: string]: string }>('addHero'))
      );
  }

  updateHero(updatedHero: Hero): Observable<any> {
    const endpointPath = createEndpointPath([updatedHero.id]);

    return this.httpClient
      .put(endpointPath, updatedHero, this._httpOptions)
      .pipe(
        tap(_ => {
          this.log(`hero updated: ${JSON.stringify(updatedHero)}`);
        })
      );
  }

  deleteHero(id: string): Observable<any> {
    const endpointPath = createEndpointPath([id]);

    return this.httpClient.delete(endpointPath, this._httpOptions).pipe(
      tap(_ => {
        this.log(`DELETE hero with ID="${id}"`);
      }),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
