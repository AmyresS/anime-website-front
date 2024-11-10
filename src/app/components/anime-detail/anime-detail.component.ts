import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../../services/anime.service';

@Component({
    selector: 'app-anime-detail',
    templateUrl: './anime-detail.component.html',
    styleUrls: ['./anime-detail.component.css'],
})
export class AnimeDetailComponent implements OnInit  {

  constructor(
    private animeService: AnimeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

  }
}