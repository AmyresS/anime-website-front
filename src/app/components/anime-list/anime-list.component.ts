import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../../services/anime.service';

@Component({
  selector: 'app-anime-list',
  templateUrl: './anime-list.component.html',
  styleUrls: ['./anime-list.component.css']
})
export class AnimeListComponent implements OnInit {
  animeList: any[] = [];
  searchQuery: string = '';

  constructor(private animeService: AnimeService) {}

  ngOnInit(): void {
    this.loadAnimeList();
  }

  loadAnimeList(): void {
    this.animeService.getAllAnime().subscribe({
      next: data => this.animeList = data,
      error: error => console.error('Помилка при завантаженні аніме:', error)
    });
  }  

  searchAnime(): void {
    if (this.searchQuery.trim()) {
      this.animeService.searchAnimeByTitle(this.searchQuery).subscribe({
        next: data => this.animeList = data,
        error: error => console.error('Помилка при пошуку аніме:', error)
      });
    } else {
      this.loadAnimeList();
    }
  }
}
