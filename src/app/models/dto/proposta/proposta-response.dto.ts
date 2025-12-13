import { StatoProposta } from "../enums/stato-proposta";

export interface PropostaResponse {
  idProposta: number;

  idInserzione: number;
  titoloInserzione: string;
  prezzoInserzione: number;

  importo: number;
  stato: StatoProposta;
  dataCreazione: string;

  proponente: 'UTENTE' | 'AGENTE';

  idUtente?: number;
  idAgente?: number;

  idPropostaPrecedente?: number;
  messaggio?: string;

}
