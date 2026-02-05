import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { InserzioneSearchResponse } from '../../../models/dto/Search/inserzionesearchresponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-inserzioni',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './listainserzione.component.html',
  styleUrls: ['./listainserzione.component.css']
})
export class ListaInserzioniComponent implements OnChanges {

  @Input() inserzioni: InserzioneSearchResponse[] = [];
  @Input() loading = false;
  @Input() comune: string = '';


  mostraNessunRisultato = false;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {

    // La ricerca è finita SOLO quando loading diventa false
    if (changes['loading'] && this.loading === false) {
      this.mostraNessunRisultato = this.inserzioni.length === 0;
    }

    // Se parte una nuova ricerca, resetto lo stato
    if (changes['loading'] && this.loading === true) {
      this.mostraNessunRisultato = false;
    }
  }

  apriDettaglio(id: number) {
    this.router.navigate(['inserzione', id]);
  }
}


