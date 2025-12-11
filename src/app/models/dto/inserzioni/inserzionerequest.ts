import {DatiInserzioneRequest} from './datiinserzionerequest';
import {Posizione} from './posizione';

export interface InserzioneRequest {
  datiInserzioneRequest: DatiInserzioneRequest;
  posizione: Posizione;
}
