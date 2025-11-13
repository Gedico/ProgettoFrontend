import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'https://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

/*********************** REGISTRAZIONE UTENTE - AGENTE - ADMIN *******************************************************/

  registerUtente(data: {nome: string; cognome: string; mail: string; password:string; numero: string;indirizzo: string; approfondimento: string; messaggio: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registerUtente`, data);
  }


  registerAgente(data: {nome: string; cognome: string; mail: string; password:string; numero: string;indirizzo: string; approfondimento: string; messaggio: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registerAgente`, data);
  }


  registerAdmin(data: {nome: string; cognome: string; mail: string; password:string; numero: string;indirizzo: string; approfondimento: string; messaggio: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/registerAdmin`, data);
  }


/************************** LOGIN **************************************************************************************** */

  login(data: {mail :string; password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, { token });
  }

}
