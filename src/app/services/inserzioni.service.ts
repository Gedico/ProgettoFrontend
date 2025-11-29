import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InserzioneCard } from '../models/inserzionecard';
import { InserzioneResponse } from '../models/inserzioneresponse';


@Injectable({
  providedIn: 'root'
})
export class InserzioneService {
  private apiUrl = 'http://localhost:8080/api/inserzioni';

  constructor(private http: HttpClient) {}

  getUltimeInserzioni(): Observable<InserzioneCard[]> {
    return this.http.get<InserzioneCard[]>(`${this.apiUrl}/recenti`);
  }

  getInserzioneById(id: number): Observable<InserzioneResponse> {
    return this.http.get<InserzioneResponse>(`${this.apiUrl}/${id}`);
  }


}
