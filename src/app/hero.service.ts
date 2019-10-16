import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';

import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = 'https://angular-udemy-course-backend.firebaseio.com';
const POSTS_PATH = 'heroes.json';

const ENDPOINT_URL = `${API_URL}/${POSTS_PATH}`;

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');

    return this.httpClient.get(ENDPOINT_URL).pipe(
      map((responseData: { [key: string]: Hero }) => {
        const heroIds = Object.keys(responseData);

        const heroes = heroIds.map(id => ({
          ...responseData[id],
          id,
        }));

        return heroes;
      })
    );
  }

  getHero(id: string): Observable<Hero> {
    this.messageService.add(`HeroService: fetched hero with ID=${id}`);

    return of(HEROES.find(hero => hero.id === id));
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
