import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AudioItem {
  _id: string; name: string; desc: string;
  imageUrl: string; audioUrl: string; durationSec: number;
}

@Injectable({ providedIn: 'root' })
export class AudioService {
  base = 'http://localhost:3000/api/audio';
  constructor(private http: HttpClient) {}

  list(page = 1, limit = 10) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<{ items: AudioItem[]; page: number; limit: number; total: number; pages: number }>(this.base, { params });
  }
  get(id: string) { return this.http.get<AudioItem>(`${this.base}/${id}`); }
  create(data: FormData) { return this.http.post<AudioItem>(this.base, data); }
  update(id: string, data: FormData) { return this.http.put<AudioItem>(`${this.base}/${id}`, data); }
  delete(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
