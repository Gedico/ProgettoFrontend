import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';;
import { RegisterRequest } from '../../models/dto/register-request.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  registerUtente(data: RegisterRequest) {
    return this.http.post<any>(`${this.apiUrl}/registerUtente`, data);
  }

  


}
