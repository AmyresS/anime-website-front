import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import ASS from 'assjs';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  isPlaying: boolean = false;
  isMuted: boolean = false;
  isFullscreen: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  clickCount = 0;
  player: any;

  ngAfterViewInit() {
    this.initializePlayer();
    this.player = document.querySelector('#player');
    this.loadVideo();
    this.loadAudio();
    this.loadSubtitles();
  }

  initializePlayer() {
    const video = this.videoElement.nativeElement;
    video.onloadedmetadata = () => {
      this.duration = video.duration;
    };
    video.ontimeupdate = () => {
      this.currentTime = video.currentTime;
    };
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
    } else {
      this.videoElement.nativeElement.pause();
      this.audioElement.nativeElement.pause();
      this.isPlaying = false;
    }
  }

  loadVideo() {
    this.videoElement.nativeElement.src = '../assets/video.mp4';
  }

  loadAudio() {
    this.audioElement.nativeElement.src = '../assets/audio_track_0.aac';
  }

  loadSubtitles() {
    fetch('../assets/Надписи.ass')
      .then(response => response.text())
      .then(assContent => {
        const ass = new ASS(assContent, this.videoElement.nativeElement, {
          container: document.querySelector('#ass-container'),
          // resampling: 'video_width',
        });
      });
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioElement.nativeElement.muted = this.isMuted;
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

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.player.requestFullscreen()
      .then(() => {
        this.isFullscreen = true;
        // this.player.requestPointerLock(); // TODO: Hide cursor and controls 3s after fullscreen toggle
      })
      .catch((error: any) => {
        console.error('Fullscreen request failed:', error);
      });
    } else {
      document.exitFullscreen()
      .then(() => {
        this.isFullscreen = false;
      })
      .catch((error: any) => {
        console.error('Exiting fullscreen failed:', error);
      });
    }
  }

  changeAudioTrack() {
    // Реалізація зміни аудіо-доріжки
  }

  changeSubtitles() {
    // Реалізація зміни субтитрів
  }
}
