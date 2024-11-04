import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../../services/anime.service';

interface Anime {
    id: number;
    title: string;
    description: string;
    genre: string;
    episodes: number;
}

@Component({
    selector: 'app-anime-list',
    templateUrl: './anime-list.component.html',
    styleUrls: ['./anime-list.component.css']
})
export class AnimeListComponent implements OnInit {
    animeList: Anime[] = []; // Явне оголошення типу Anime[]
    searchQuery: string = '';
    selectedGenre: string = '';
    genres: string[] = ['Action', 'Adventure', 'Fantasy', 'Drama', 'Comedy', 'Romance']; // перелік жанрів

    constructor(private animeService: AnimeService) {}

    ngOnInit(): void {
        this.animeService.getAllAnime().subscribe((data: Anime[]) => {
            this.animeList = data;
        });
    }


    filteredAnimeList(): Anime[] {
        return this.animeList.filter(anime => {
            const matchesSearch = anime.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesGenre = this.selectedGenre ? anime.genre === this.selectedGenre : true;
            return matchesSearch && matchesGenre;
        });
    }
}