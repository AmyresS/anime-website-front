import { Component, ElementRef, HostListener, ViewChild, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import { AnimeService } from '../../services/anime.service';
import ASS from 'assjs';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements AfterViewInit {

  constructor(
    private animeService: AnimeService
  ) {}

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  @Input() video: any;
  @Input() audioTracks: any[] = []; // Аудіо-доріжки
  @Input() subtitles: any[] = [];   // Субтитри

  videoUrl: string | null = null;
  audioUrl: string | null = null;

  currentSubtitle: string = '';
  hoverTimeVisible: boolean = false;
  isFullscreen: boolean = false;
  isMuted: boolean = false;
  isPlaying: boolean = false;
  bufferedPercentage: number = 0;
  currentTime: number = 0;
  clickCount = 0;
  duration: number = 0;
  hoverTime: number = 0;
  hoverTimePosition: number = 0;
  playedPercentage: number = 0;
  previousVolume: number = 1;
  assContainer: any;
  currentAssInstance: any | null = null;
  hideControlsTimeout: any;
  player: any;
  volumeSlider: any;

  ngAfterViewInit() {
    this.initializePlayer();
    
    this.player = document.querySelector('#player');
    this.volumeSlider = document.querySelector('#volumeSlider');
    this.assContainer = document.querySelector('#ass-container');

    this.videoElement.nativeElement.addEventListener('progress', this.updateBuffer.bind(this));
    this.videoElement.nativeElement.addEventListener('timeupdate', this.updateProgress.bind(this));

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        this.togglePlayback();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.togglePlayback();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['video'] && changes['video'].currentValue) {
      this.loadMedia();
    }
    // if (changes['subtitles']) {
    //   this.loadSubtitles();
    // }
  }

  // Метод для очищення URL, коли компонент знищується
  ngOnDestroy(): void {
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

  /* Player & media initialization */

  initializePlayer() {
    const video = this.videoElement.nativeElement;
    video.onloadedmetadata = () => {
      this.duration = video.duration;
    };
    video.ontimeupdate = () => {
      this.currentTime = video.currentTime;
    };
  }

  loadMedia() {
    const videoUrl = this.animeService.streamMedia(this.video.id, 'video');
    const audioUrl = this.animeService.streamMedia(this.audioTracks[0].id, 'audio');
    
    this.videoElement.nativeElement.src = videoUrl;
    this.audioElement.nativeElement.src = audioUrl;
    this.videoElement.nativeElement.load();  
    // this.audioElement.nativeElement.load();  
  }
  

  loadSubtitles(subtitle: any): void {
    const subtitleUrl = this.animeService.streamMedia(subtitle, 'subtitles');
  
    fetch(subtitleUrl)
      .then(response => response.text())
      .then(assContent => {
        if (this.currentAssInstance) {
          this.currentAssInstance.destroy();
        }
        this.currentAssInstance = new ASS(assContent, this.videoElement.nativeElement, {
          container: this.assContainer,
        });
      })
      .catch(error => console.error('Помилка при завантаженні субтитрів:', error));
  }
  
  updateBuffer() {
    const video = this.videoElement.nativeElement;
    if (video.buffered.length) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      this.bufferedPercentage = (bufferedEnd / video.duration) * 100;
    }
  }

  updateProgress() {
    const video = this.videoElement.nativeElement;
    if (video.duration > 0) {
      this.playedPercentage = (video.currentTime / video.duration) * 100;
    }
  }
  
  /* Player controls */

  getFormattedTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const hoursStr = hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : '';
    const minutesStr = mins.toString().padStart(2, '0');
    const secondsStr = secs.toString().padStart(2, '0');

    return `${hoursStr}${minutesStr}:${secondsStr}`;
}

  
  hideHoverTime() {
    this.hoverTimeVisible = false;
  }

  handleClick() {
    this.clickCount++;
    setTimeout(() => {
        if (this.clickCount === 1) {
          this.togglePlayback();
        } else if (this.clickCount === 2) {
            this.toggleFullscreen();
        }
        this.clickCount = 0;
    }, 250)
  }

  changeVolume() {
    const volume = parseFloat(this.volumeSlider.value);

    if (volume > 0) {
      this.isMuted = false;
      this.audioElement.nativeElement.muted = false;
    }
    else if (volume == 0) {
      this.isMuted = true;
    }

    this.audioElement.nativeElement.volume = volume;
  }

  seekVideo(event: Event) {
    const target = event.target as HTMLInputElement;
    this.syncMediaTime(parseFloat(target.value));
  }

  syncMediaTime(time: number) {
    this.videoElement.nativeElement.currentTime = time;
    this.audioElement.nativeElement.currentTime = time;
    this.currentTime = time;
  }

  showHoverTime(event: MouseEvent) {
    const target = event.target as HTMLInputElement;
    const rect = target.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    this.hoverTime = position * this.duration;
    this.hoverTimePosition = event.clientX - rect.left;
    this.hoverTimeVisible = true;
  }

  togglePlayback() {
    if (this.videoElement.nativeElement.paused) {
      this.videoElement.nativeElement.play().catch(error => {
        console.warn('Video play was prevented:', error);
      });
      this.audioElement.nativeElement.play().catch(error => {
        console.warn('Audio play was prevented:', error);
      });
      this.isPlaying = true;
      this.startHideControlsTimer();
    } else {
      this.videoElement.nativeElement.pause();
      this.audioElement.nativeElement.pause();
      this.isPlaying = false;
      this.showControls();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  
    if (this.isMuted) {
      this.previousVolume = this.audioElement.nativeElement.volume;
      this.audioElement.nativeElement.volume = 0;
    } else {
      this.audioElement.nativeElement.volume = this.previousVolume;
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.player.requestFullscreen().catch(error => console.error('Fullscreen request failed:', error));
    } else {
      document.exitFullscreen().catch(error => console.error('Exiting fullscreen failed:', error));
    }
    this.isFullscreen = !this.isFullscreen;
    this.isFullscreen ? this.startHideControlsTimer() : this.showControls();
  }

  startHideControlsTimer() {
    if (this.isPlaying && this.isFullscreen) {
      clearTimeout(this.hideControlsTimeout);
      this.hideControlsTimeout = setTimeout(() => {
        this.hideControls();
      }, 3000);
    }
  }

  hideControls() {
    document.querySelector('.controls')?.classList.add('hidden');
    document.body.style.cursor = 'none';
  }

  showControls() {
    clearTimeout(this.hideControlsTimeout);
    document.querySelector('.controls')?.classList.remove('hidden');
    document.body.style.cursor = 'default';
  }

  @HostListener('mousemove')
  onUserActivity() {
    if (this.isFullscreen && this.isPlaying) {
      this.showControls();
      this.startHideControlsTimer();
    }
  }

  /* Streaming */

  changeAudioTrack(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const audioId = Number(target.value);
    if (audioId) {
      this.audioElement.nativeElement.src = this.animeService.streamMedia(audioId, 'audio');
      this.audioElement.nativeElement.load();
      this.audioElement.nativeElement.play();
      this.syncMediaTime(this.currentTime);
    }
  }  

  changeSubtitles(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const subtitleId = target.value;
    // Очищуємо попередні субтитри
    if (this.currentAssInstance) {
      this.currentAssInstance.destroy();
      this.currentAssInstance = null;
    }

    if (subtitleId === 'none') {
      this.disableSubtitles(); // Вимикаємо субтитри
    } else {
      const selectedSubtitle = this.subtitles.find(sub => sub.id.toString() === subtitleId);
      if (selectedSubtitle) {
        this.loadSubtitles(selectedSubtitle.id);
      }
    }
  }

  disableSubtitles(): void {
    if (this.currentAssInstance) {
      this.currentAssInstance.destroy();
      this.currentAssInstance = null;
    }
  }
}
