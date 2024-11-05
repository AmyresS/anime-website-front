import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../../services/anime.service';

@Component({
    selector: 'app-anime-detail',
    templateUrl: './anime-detail.component.html',
    styleUrls: ['./anime-detail.component.css']
})
export class AnimeDetailComponent implements OnInit {
    anime: any;

    constructor(
        private animeService: AnimeService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.animeService.getAnimeById(id).subscribe((data) => {
            this.anime = data;
        });
    }
}
