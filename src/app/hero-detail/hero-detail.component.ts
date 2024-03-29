import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
})
export class HeroDetailComponent implements OnInit {
  hero: Hero;

  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.getHero();
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.heroService.getHero(id).subscribe((hero: Hero) => {
      this.hero = hero;
    });
  }

  save(): void {
    const updatedHero = this.hero;

    this.heroService.updateHero(updatedHero).subscribe((hero: Hero) => {
      console.log('updated hero:', hero);
    });
  }

  goBack() {
    this.location.back();
  }
}
