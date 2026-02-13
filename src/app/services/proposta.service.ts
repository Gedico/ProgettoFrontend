import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PropostaRequest } from '../models/dto/proposta/proposta-request.dto';
import { PropostaResponse } from '../models/dto/proposta/proposta-response.dto';
import { StatoProposta } from '../models/dto/enums/stato-proposta';
import {ContropropostaRequest} from '../models/dto/proposta/controproposta-request-dto';
import {PropostaManualeRequest} from '../models/dto/proposta/proposta-manuale-request.dto';
import { environment } from '../../envoiroments/envoiroment';

@Injectable({
  providedIn: 'root'
})
export class PropostaService {

 private baseUrl = `${environment.apiUrl}/api/proposte`;


  constructor(private http: HttpClient) {}

  // 🔹 1) Invia una nuova proposta
  inviaProposta(request: PropostaRequest): Observable<PropostaResponse> {
    return this.http.post<PropostaResponse>(`${this.baseUrl}`, request);
  }

  // 🔹 2) Recupera proposte dell'agente autenticato
  getProposteAgente(): Observable<PropostaResponse[]> {
    return this.http.get<PropostaResponse[]>(`${this.baseUrl}`);
  }

  // 🔹 3) Recupera proposte dell'agente filtrate per stato
  getProposteAgenteByStato(stato: StatoProposta): Observable<PropostaResponse[]> {
    return this.http.get<PropostaResponse[]>(
      `${this.baseUrl}/filtra`,
      { params: { stato } }
    );
  }

  // 🔹 4) Recupera dettagli di una singola proposta
  getDettagliProposta(id: number): Observable<PropostaResponse> {
    return this.http.get<PropostaResponse>(`${this.baseUrl}/${id}`);
  }

  // 🔹 5) Aggiorna stato proposta (ACCETTATA / RIFIUTATA)
  aggiornaStato(id: number, nuovoStato: StatoProposta): Observable<PropostaResponse> {
    return this.http.put<PropostaResponse>(
      `${this.baseUrl}/${id}/stato`,
      { nuovoStato }
    );
  }

  // 🔹 6) Elimina una proposta inviata dall'utente
  eliminaProposta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getProposteUtente(): Observable<PropostaResponse[]> {
    return this.http.get<PropostaResponse[]>(`${this.baseUrl}/mie`);
  }

  // 🔹 7) Recupera registro proposte (ACCETTATE + RIFIUTATE)
  getRegistroProposte(): Observable<PropostaResponse[]> {
    return this.http.get<PropostaResponse[]>(`${this.baseUrl}/registro`);
  }


  // 🔹 8) Controproposta da parte dell'agente
  creaControproposta(
    idProposta: number,
    request: ContropropostaRequest
  ): Observable<PropostaResponse> {
    return this.http.post<PropostaResponse>(
      `${this.baseUrl}/${idProposta}/controproposta`,
      request
    );
  }

  creaPropostaManuale(
    idInserzione: number,
    request: PropostaManualeRequest
  ): Observable<PropostaResponse> {
    return this.http.post<PropostaResponse>(
      `${this.baseUrl}/inserzioni/${idInserzione}/manuale`,
      request
    );
  }



}
