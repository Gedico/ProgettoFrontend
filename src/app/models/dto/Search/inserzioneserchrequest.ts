export interface InserzioneSearchRequest {
  comune: string;              // OBBLIGATORIO
  categoria?: string;
  prezzoMin?: number;
  prezzoMax?: number;
  dimensioniMin?: number;
  dimensioniMax?: number;
  numeroStanze?: number;
  ascensore?: boolean;
  stato?: string;
}
