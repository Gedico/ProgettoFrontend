import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InserzioneCard } from '../models/inserzionecard';

@Injectable({
  providedIn: 'root'
})
export class InserzioneService {

  private apiUrl = 'http://localhost:8080/api/inserzioni';

  constructor(private http: HttpClient) {}

  getUltimeInserzioni(): Observable<InserzioneCard[]> {
    return this.http.get<InserzioneCard[]>(`${this.apiUrl}/recenti`);
  }
}
