export interface DatiInserzioneRequest {
  titolo: string;
  descrizione: string;
  prezzo: number;               // BigDecimal → number in FE
  dimensioni: number;
  numero_stanze: number;        // deve restare snake_case
  piano: number | null;
  ascensore: boolean;
  classe_energetica: string;    // anche questo snake_case
  categoria: string;            // enum → string lato FE
}
