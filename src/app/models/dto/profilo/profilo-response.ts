import { Role } from '../enums/role'; // se hai già un enum, altrimenti usa string

export interface ProfiloResponse {
  nome: string;
  cognome: string;
  numero: string;
  indirizzo?: string | null;
  mail: string;
  ruolo: Role | string;

}
