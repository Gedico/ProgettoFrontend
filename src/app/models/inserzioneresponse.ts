import { DatiInserzioneResponse } from "./dto/datiinserzioneresponse";
import { PosizioneResponse } from "./dto/posizioneresponse";
import { FotoResponse } from "./dto/fotoresponse";

export interface InserzioneResponse {
  id: number;
  dati: DatiInserzioneResponse;
  posizione: PosizioneResponse;
  foto: FotoResponse[];
  messaggio: string;
}