import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InserzioneCard } from '../models/inserzionecard';
import { InserzioneResponse } from '../models/inserzioneresponse';


@Injectable({
  providedIn: 'root'
})
export class InserzioneService {
  private apiUrl = 'http://localhost:8080/api/inserzioni';

  constructor(private http: HttpClient) {
  }

  creaInserzione(dati: any, immagini: File[]) {
    const formData = new FormData();

    // JSON → deve chiamarsi esattamente "dati"
    formData.append(
      'dati',
      new Blob([JSON.stringify(dati)], { type: 'application/json' })
    );

    // Immagini
    for (const img of immagini) {
      formData.append('immagini', img);
    }

    // L'interceptor aggiunge automaticamente l'Authorization
    return this.http.post(`${this.apiUrl}/crea`, formData);
  }



  getUltimeInserzioni(): Observable<InserzioneCard[]> {
    return this.http.get<InserzioneCard[]>(`${this.apiUrl}/recenti`);
  }

  getInserzioneById(id: number): Observable<InserzioneResponse> {
    return this.http.get<InserzioneResponse>(`${this.apiUrl}/${id}`);
  }

  ricercaInserzioni(filtri: any): Observable<InserzioneResponse[]> {
    let params = new HttpParams();

    Object.keys(filtri).forEach(key => {
      if (filtri[key] !== null && filtri[key] !== '') {
        params = params.set(key, filtri[key]);
      }
    });

    return this.http.get<InserzioneResponse[]>(`${this.apiUrl}/ricerca`, {params});
  }
}
