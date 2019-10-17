import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { Observable, Subject } from 'rxjs';
import { HeroService } from '../hero.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss'],
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private _searchTerms = new Subject<string>();

  private _resultsCount: number;
  public get resultsCount(): number {
    return this._resultsCount;
  }

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.heroes$ = this._searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.heroService.searchHeroes(term))
      )
      .pipe(
        tap(heroes => {
          this._resultsCount = heroes.length;
        })
      );
  }

  search(term: string): void {
    this._searchTerms.next(term);
  }
}
