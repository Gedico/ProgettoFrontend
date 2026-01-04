export interface InserzioneSearchResponse{
  idInserzione: number;
  titolo: string;
  descrizione: string;
  comune: string;
  latitudine: number;
  longitudine: number;
  prezzo: number;
  dimensione: number;
  stanze?: number;
  piano?: number;
  ascensore?: boolean;
  classeEnergetica?: string;
  fotoUrls: string[];
  tipo: string;
}
