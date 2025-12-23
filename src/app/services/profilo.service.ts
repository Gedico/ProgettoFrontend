import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProfiloResponse } from '../models/dto/profilo/profilo-response';
import { UpdateProfiloRequest } from '../models/dto/profilo/update-profilo-request';
import { UpdateProfiloResponse } from '../models/dto/profilo/update-profilo-response';

@Injectable({
  providedIn: 'root'
})
export class ProfiloService {

  private api = 'http://localhost:8080/api/profilo';

  constructor(private http: HttpClient) {}

  getProfilo(): Observable<ProfiloResponse> {
    return this.http.get<ProfiloResponse>(`${this.api}`);
  }

  updateProfilo(payload: UpdateProfiloRequest): Observable<UpdateProfiloResponse> {
    return this.http.put<UpdateProfiloResponse>(`${this.api}`, payload);
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.put(
      `${this.api}/change-password`,
      {
        oldPassword,
        newPassword
      }
    );
  }
}

