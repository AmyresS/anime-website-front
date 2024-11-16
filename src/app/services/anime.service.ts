import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

interface MediaFile {
  id: number;
  fileType: string;
  fileName: string;
  language: string | null;
}

interface MediaResponse {
  media: MediaFile[];
}

@Injectable({
  providedIn: 'root'
})

export class AnimeService {
  private apiUrl = 'http://localhost:5000/api/anime';

  constructor(private http: HttpClient) {}

  getAllAnime(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  searchAnimeByTitle(title: string): Observable<any> {
    const params = new HttpParams().set('title', title);
    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getAnimeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/details`);
  }

  getEpisodesByAnimeId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/episodes`);
  }

  getMedia(animeId: number, episodeNumber: number): Observable<MediaFile[]> {
    return this.http.get<MediaResponse>(`${this.apiUrl}/${animeId}/episode/${episodeNumber}/media`).pipe(
      map(response => response.media)
    );
  }  

  streamMedia(id: number, type: string): string {
    return `${this.apiUrl}/stream/${id}?type=${type}`;
  }
}
