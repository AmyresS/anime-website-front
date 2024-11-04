import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../../services/anime.service';

@Component({
    selector: 'app-anime-detail',
    templateUrl: './anime-detail.component.html',
    styleUrls: ['./anime-detail.component.css']
})
export class AnimeDetailComponent implements OnInit {
    anime: any;
    episodeList: string[] = [];
    currentEpisode: string = '';
    videoSource: string = '';
    subtitleTracks: TextTrack[] = [];
    selectedSubtitleTrack: number = -1;

    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

    constructor(
        private animeService: AnimeService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.animeService.getAnimeById(id).subscribe((data) => {
            this.anime = data;
            this.loadEpisodes();
        });
    }

    loadEpisodes(): void {
        const title = this.anime.title;
        this.animeService.getAnimeEpisodes(title).subscribe((episodes) => {
            this.episodeList = episodes;
            if (episodes.length > 0) {
                this.playEpisode(episodes[0]);
            }
        });
    }

    playEpisode(episode: string): void {
        this.currentEpisode = episode;
        this.videoSource = this.animeService.streamEpisode(this.anime.title, episode);

        // Оновлюємо субтитри при зміні серії
        this.updateSubtitleTracks();
    }

    nextEpisode(): void {
        const currentIndex = this.episodeList.indexOf(this.currentEpisode);
        if (currentIndex < this.episodeList.length - 1) {
            this.playEpisode(this.episodeList[currentIndex + 1]);
        }
    }

    previousEpisode(): void {
        const currentIndex = this.episodeList.indexOf(this.currentEpisode);
        if (currentIndex > 0) {
            this.playEpisode(this.episodeList[currentIndex - 1]);
        }
    }

    updateSubtitleTracks(): void {
        const video = this.videoPlayer.nativeElement;
        video.textTracks[0].mode = 'showing'; // Показуємо першу доріжку за замовчуванням
        this.subtitleTracks = Array.from(video.textTracks);
    }

    toggleSubtitleTrack(index: number): void {
        this.subtitleTracks.forEach((track, i) => {
            track.mode = i === index ? 'showing' : 'hidden';
        });
        this.selectedSubtitleTrack = index;
    }
}
