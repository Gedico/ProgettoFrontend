import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PropostaService } from '../../../services/proposta.service';
import { PropostaResponse } from '../../../models/dto/proposta/proposta-response.dto';
import { StatoProposta } from '../../../models/dto/enums/stato-proposta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proposte-ricevute',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './proposte-ricevute.component.html',
  styleUrls: ['./proposte-ricevute.component.css']
})
export class ProposteRicevuteComponent implements OnInit {

  displayedColumns = ['titolo', 'importo', 'data', 'azioni'];
  proposte: PropostaResponse[] = [];
  loading = false;

  StatoProposta = StatoProposta;

  constructor(private propostaService: PropostaService) {}

  ngOnInit(): void {
    this.caricaProposte();
  }

  caricaProposte() {
    this.loading = true;
    this.propostaService.getProposteAgenteByStato(StatoProposta.IN_ATTESA).subscribe({
      next: res => {
        this.proposte = res || [];
        this.loading = false;
      },
      error: _ => this.loading = false
    });
  }

  aggiornaStato(id: number, nuovoStato: StatoProposta) {
    Swal.fire({
      title: nuovoStato === StatoProposta.ACCETTATA ? 'Accettare la proposta?' : 'Rifiutare la proposta?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Conferma',
      cancelButtonText: 'Annulla'
    }).then(result => {
      if (result.isConfirmed) {
        this.propostaService.aggiornaStato(id, nuovoStato).subscribe(() => {
          Swal.fire('Fatto!', 'Stato aggiornato con successo', 'success');
          this.caricaProposte();
        });
      }
    });
  }
}
