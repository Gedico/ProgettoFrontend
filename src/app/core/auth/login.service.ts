import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {LoginResponse} from '../../models/dto/auth/login-response.dto';
import {LoginRequest} from '../../models/dto/auth/login-request.dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }

  logout(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, { token });
  }
}
