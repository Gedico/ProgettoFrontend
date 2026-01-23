import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InserzioneService } from '../../services/inserzioni.service';
import {  InserzioneSearchRequest } from '../../models/dto/Search/inserzioneserchrequest';
import {  InserzioneSearchResponse } from '../../models/dto/Search/inserzionesearchresponse';
import { InserzioniStoreService } from '../../services/store/inserzione.store.service';
import { ListaInserzioniComponent } from "./listainserzione/listainserzione.component";
import { MappaInterattivaComponent } from "./mappainterattiva/mappainterattiva.component";
import { MarkerDTO } from '../../models/dto/Search/markerdto';


@Component({
  selector: 'app-risultati',
  standalone: true,
  imports: [CommonModule, ListaInserzioniComponent, MappaInterattivaComponent],
  templateUrl: './risultati.component.html',
  styleUrl:'./risultati.component.css'
  
})
export class RisultatiComponent implements OnInit {

  // ✅ Devono essere dichiarate qui
  inserzioni: InserzioneSearchResponse[] = [];
  previewInserzioni: InserzioneSearchResponse[] = [];
  comune!: string;
  inserzioniPreview: any;
  markerInserzioni: MarkerDTO[] = []; // mai undefined


  constructor(
    private route: ActivatedRoute,
    private inserzioneService: InserzioneService,
    private store: InserzioniStoreService
  ) {}

    ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const request: InserzioneSearchRequest = {
      comune: params['comune'],
      categoria: params['categoria'],
      prezzoMin: params['prezzoMin'] ? Number(params['prezzoMin']) : undefined,
      prezzoMax: params['prezzoMax'] ? Number(params['prezzoMax']) : undefined,
      dimensioniMin: params['dimensioniMin'] ? Number(params['dimensioniMin']) : undefined,
      dimensioniMax: params['dimensioniMax'] ? Number(params['dimensioniMax']) : undefined,
      numeroStanze: params['numeroStanze'] ? Number(params['numeroStanze']) : undefined,
      ascensore: params['ascensore'] === 'true' ? true : undefined,
      stato: params['stato']
    };

    this.comune = request.comune || '';

    this.inserzioneService.ricercaInserzioni(request).subscribe(res => {
      this.inserzioni = res;
      this.previewInserzioni = res.slice(0, 4);

      console.log('Inserzioni complete ricevute:', this.inserzioni);

      this.markerInserzioni = this.previewInserzioni.map(i => ({
        id: i.idInserzione,
        prezzo: i.prezzo,
        latitudine: Number(i.latitudine),
        longitudine: Number(i.longitudine)
      }));

      this.store.setRisultati(res);
    });
  });
}


}

