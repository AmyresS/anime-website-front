import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Anime {
    id: number;
    title: string;
    description: string;
    genre: string;
    episodes: number;
}

@Injectable({
    providedIn: 'root'
})
export class AnimeService {
    private apiUrl = 'http://localhost:5000/api/anime';

    constructor(private http: HttpClient) {}

    getAllAnime(): Observable<Anime[]> {
        return this.http.get<Anime[]>(this.apiUrl);
    }

    getAnimeById(id: number): Observable<Anime> {
        return this.http.get<Anime>(`${this.apiUrl}/${id}`);
    }

    createAnime(anime: Anime): Observable<Anime> {
        return this.http.post<Anime>(this.apiUrl, anime);
    }

    updateAnime(id: number, anime: Anime): Observable<Anime> {
        return this.http.put<Anime>(`${this.apiUrl}/${id}`, anime);
    }

    deleteAnime(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
