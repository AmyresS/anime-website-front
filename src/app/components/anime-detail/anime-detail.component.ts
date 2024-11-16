import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../../services/anime.service';
import { Observable, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-anime-detail',
  templateUrl: './anime-detail.component.html',
  styleUrls: ['./anime-detail.component.css']
})
export class AnimeDetailComponent {
  anime$: Observable<any>;
  mediaFiles$: Observable<any[]>;
  video$: Observable<string>;
  audios$: Observable<any[]>;
  subtitles$: Observable<any[]>;

  constructor(private animeService: AnimeService, private route: ActivatedRoute) {
    const animeId = this.route.snapshot.params['id'];

    this.anime$ = this.animeService.getAnimeById(animeId);

    this.mediaFiles$ = this.route.params.pipe(
      switchMap(params => this.animeService.getMedia(params['id'], 1))
    );    

    this.video$ = this.mediaFiles$.pipe(
      map(media => media.find(file => file.fileType === 'video') || null)
    );

    this.audios$ = this.mediaFiles$.pipe(
      map(media => media.filter(file => file.fileType === 'audio'))
    );

    this.subtitles$ = this.mediaFiles$.pipe(
      map(media => media.filter(file => file.fileType === 'subtitles'))
    );
  }
}
