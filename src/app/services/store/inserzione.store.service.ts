import { Injectable } from '@angular/core';
import { InserzioneSearchResponse } from '../../models/dto/Search/inserzionesearchresponse';

@Injectable({ providedIn: 'root' })
export class InserzioniStoreService {
  private risultatiSearch: InserzioneSearchResponse[] = [];

  setRisultati(risultati: InserzioneSearchResponse[]) {
    this.risultatiSearch = risultati;
  }

  getRisultati(): InserzioneSearchResponse[] {
    return this.risultatiSearch;
  }
}
