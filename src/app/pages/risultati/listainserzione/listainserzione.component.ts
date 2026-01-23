import { Component, Input } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import {  InserzioneSearchResponse } from '../../../models/dto/Search/inserzionesearchresponse';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lista-inserzioni',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './listainserzione.component.html',
  styleUrls:['./listainserzione.component.css']
})
export class ListaInserzioniComponent {
  // Input dal componente genitore (RisultatiComponent)
  @Input() inserzioni: InserzioneSearchResponse[] = [];

  constructor(private router: Router) {}

  apriDettaglio(id: number) {
    // Naviga alla pagina /{id}
    this.router.navigate(['inserzione',id]);

  }


  
}

