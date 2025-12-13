import { StatoProposta } from "../enums/stato-proposta";

export interface PropostaResponse {
  idProposta: number;
  titoloInserzione: string;
  importo: number;
  prezzoInserzione: number;
  stato: StatoProposta;
  dataCreazione: string;
  messaggio?: string;
  idInserzione?: number; // utile per redirect
}
