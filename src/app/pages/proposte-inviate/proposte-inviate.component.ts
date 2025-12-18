import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropostaService } from '../../services/proposta.service';
import { PropostaResponse } from '../../models/dto/proposta/proposta-response.dto';
import {StatoProposta} from '../../models/dto/enums/stato-proposta';

import { PropostaCardComponent } from '../../components/proposta-card/proposta-card.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-proposte-inviate',
  standalone: true,
  imports: [CommonModule, PropostaCardComponent],
  templateUrl: './proposte-inviate.component.html',
  styleUrls: ['./proposte-inviate.component.css']
})
export class ProposteInviateComponent implements OnInit {

  // Tutte le proposte dell’utente
  proposte: PropostaResponse[] = [];
  // sezioni gestioni stato proposta
  proposteAttive: PropostaResponse[] = [];
  proposteAccettate: PropostaResponse[] = [];
  proposteRifiutate: PropostaResponse[] = [];


  // Suddivisione logica necessaria
  controproposteAttive: PropostaResponse[] = [];


  caricamento = true;

  constructor(private propostaService: PropostaService)
 {}
  ngOnInit(): void {
    this.caricaProposte();
  }

  caricaProposte(): void {
    this.propostaService.getProposteUtente().subscribe({
      next: (res) => {
        this.proposte = res || [];

        // 🔹 CONTROPROPOSTE (azioni richieste)
        this.controproposteAttive = this.proposte.filter(
          p => p.stato === StatoProposta.CONTROPROPOSTA
        );

        // 🔹 PROPOSTE ATTIVE (in attesa)
        this.proposteAttive = this.proposte.filter(
          p => p.stato === StatoProposta.IN_ATTESA
        );

        // 🔹 PROPOSTE ACCETTATE
        this.proposteAccettate = this.proposte.filter(
          p => p.stato === StatoProposta.ACCETTATA
        );

        // 🔹 PROPOSTE RIFIUTATE (storico)
        this.proposteRifiutate = this.proposte.filter(
          p => p.stato === StatoProposta.RIFIUTATA
        );

        this.caricamento = false;
      }

    });
  }
  accetta(proposta: PropostaResponse): void {
    Swal.fire({
      title: 'Accettare la controproposta?',
      text: 'Accettando, la proposta verrà considerata conclusa.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sì, accetta',
      cancelButtonText: 'Annulla',
      confirmButtonColor: '#28a745'
    }).then(result => {
      if (result.isConfirmed) {
        this.propostaService.aggiornaStato(
          proposta.idProposta,
          StatoProposta.ACCETTATA
        ).subscribe({
          next: () => {
            Swal.fire('Accettata', 'Controproposta accettata.', 'success').then(() => {
            });
            proposta.stato = StatoProposta.ACCETTATA;
          },
          error: err => {
            Swal.fire('Errore', err?.error?.message || 'Errore.', 'error').then(() => {
            });
          }
        });
      }
    });
  }

  rifiuta(proposta: PropostaResponse): void {
    Swal.fire({
      title: 'Rifiutare la controproposta?',
      text: 'Questa azione non può essere annullata.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì, rifiuta',
      cancelButtonText: 'Annulla',
      confirmButtonColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {
        this.propostaService.aggiornaStato(
          proposta.idProposta,
          StatoProposta.RIFIUTATA
        ).subscribe({
          next: () => {
            Swal.fire('Rifiutata', 'Controproposta rifiutata.', 'info').then(() => {
            });
            proposta.stato = StatoProposta.RIFIUTATA;
          },
          error: err => {
            Swal.fire('Errore', err?.error?.message || 'Errore.', 'error').then(() => {
            });
          }
        });
      }
    });
  }


}
