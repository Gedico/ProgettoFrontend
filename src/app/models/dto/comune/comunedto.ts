export interface ComuneDTO {
  sigla_provincia: string;
  codice_istat: string;
  denominazione_ita: string;
  denominazione_ita_altra: string;
  denominazione_altra: string;
  flag_capoluogo: 'SI' | 'NO';
  codice_belfiore: string;
  lat: string;
  lon: string;
  superficie_kmq: string;
  codice_sovracomunale: string;
}
