import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InserzioneCard } from '../models/inserzionecard';
import { InserzioneResponse } from '../models/inserzioneresponse';
import { InserzioneSearchRequest } from '../models/dto/Search/inserzioneserchrequest';
import { InserzioneSearchResponse } from '../models/dto/Search/inserzionesearchresponse';
import { environment } from '../../envoiroments/envoiroment';



@Injectable({
  providedIn: 'root'
})
export class InserzioneService {
 private apiUrl = `${environment.apiUrl}/api/inserzioni`;


  private risultatiSearch: InserzioneResponse[] = [];



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

  // 🔹 Dettaglio inserzione
  getInserzioneById(id: number): Observable<InserzioneResponse> {
    return this.http.get<InserzioneResponse>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Ricerca inserzioni corretta
  ricercaInserzioni(
    filtri: InserzioneSearchRequest
  ): Observable<InserzioneSearchResponse[]> {
    return this.http.post<InserzioneSearchResponse[]>(`${this.apiUrl}/search`, filtri);
  }


  // 🔹 ottiene le inserzioni dell'agente loggato
  getInserzioniAgente(): Observable<InserzioneCard[]> {
    return this.http.get<InserzioneCard[]>(`${this.apiUrl}/mie`);
  }


}

