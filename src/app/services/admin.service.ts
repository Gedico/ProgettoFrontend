import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../envoiroments/envoiroment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = `${environment.apiUrl}/api/auth`;


  constructor(private http: HttpClient) {}

  creaAgente(request: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registerAgente`, request);
  }
}
