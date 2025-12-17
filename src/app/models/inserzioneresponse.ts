import { DatiInserzioneResponse } from "./dto/datiinserzioneresponse";
import { PosizioneResponse } from "./dto/posizioneresponse";
import { FotoResponse } from "./dto/fotoresponse";
import {IndicatoreResponse} from './dto/indicatori/indicatoreresponse';

export interface InserzioneResponse {
  id: number;
  dati: DatiInserzioneResponse;
  posizione: PosizioneResponse;
  indicatore: IndicatoreResponse;
  foto: FotoResponse[];
  messaggio: string;
}
