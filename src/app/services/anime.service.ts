import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private apiUrl = 'http://localhost:5000/api/anime';

  constructor(private http: HttpClient) {}

  getAllAnime(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  searchAnimeByTitle(title: string): Observable<any> {
    const params = new HttpParams().set('title', title);
    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getAnimeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/details`);
  }

  getEpisodesByAnimeId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/episodes`);
  }

  getEpisodeVideo(id: number, episodeNumber: number): string {
    return `${this.apiUrl}/${id}/episode/${episodeNumber}/video`;
  }

  getEpisodeAudio(id: number, episodeNumber: number, track: number): string {
    return `${this.apiUrl}/${id}/episode/${episodeNumber}/audio/${track}`;
  }

  getEpisodeSubtitles(id: number, episodeNumber: number, subTrack: number): string {
    return `${this.apiUrl}/${id}/episode/${episodeNumber}/subtitles/${subTrack}`;
  }
}
