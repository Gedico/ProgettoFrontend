import { CategoriaImmobile } from './categoria-immobile.type';
import { PianoImmobile } from './piano-immobile.type';
import { ServiziFiltroDTO } from './servizi-filtro.dto';
import { BoundingBoxDTO } from './bounding-box.dto';

export interface FiltroRicercaDTO {
  testo?: string;
  citta?: string;

  categorie?: CategoriaImmobile[];

  prezzoMin?: number;
  prezzoMax?: number;

  superficieMin?: number;
  localiMin?: number;
  bagniMin?: number;

  piano?: PianoImmobile;

  servizi?: Partial<ServiziFiltroDTO>;

  boundingBox?: BoundingBoxDTO;
}
