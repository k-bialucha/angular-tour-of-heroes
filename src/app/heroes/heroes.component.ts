import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  selectedHero: Hero;
  heroes: Hero[];

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    this.heroService.getHeroes().subscribe((heroes: Hero[]) => {
      this.heroes = heroes;
    });
  }

  addHero(name: string) {
    const nameTrimmed = name.trim();

    if (!nameTrimmed) return;

    this.heroService.createHero(name).subscribe(() => {
      this.getHeroes();
    });
  }

  deleteHero(id: string) {
    console.warn('will delete:', id);
    this.heroService.deleteHero(id).subscribe(data => {
      console.warn('delete data:', data);
      this.getHeroes();
    });
  }
}
