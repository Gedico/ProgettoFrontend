import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../envoiroments/envoiroment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

 private baseUrl = `${environment.apiUrl}/api/images`;

  constructor(private http: HttpClient) {}

  // Primo metodo: ottenere l’URL pubblico di un’immagine
  getImageUrl(filename: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/url/${filename}`, {
      responseType: 'text'
    });
  }
}

