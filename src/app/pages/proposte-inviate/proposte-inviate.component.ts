import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PropostaService } from '../../services/proposta.service';
import { PropostaResponse } from '../../models/dto/proposta/proposta-response.dto';
import {StatoProposta} from '../../models/dto/enums/stato-proposta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proposte-inviate',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proposte-inviate.component.html',
  styleUrls: ['./proposte-inviate.component.css']
})
export class ProposteInviateComponent implements OnInit {

  // Tutte le proposte dell’utente
  proposte: PropostaResponse[] = [];

  // Suddivisione logica necessaria
  controproposteAttive: PropostaResponse[] = [];
  proposteInviate: PropostaResponse[] = [];

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

        // 🔹 Controproposte ricevute dall’agente
        this.controproposteAttive = this.proposte.filter(
          p => p.proponente === 'AGENTE'
        );

        // 🔹 Proposte inviate dall’utente
        this.proposteInviate = this.proposte.filter(
          p => p.proponente === 'UTENTE'
        );

        this.caricamento = false;
      },
      error: () => {
        this.caricamento = false;
      }
    });
  }

  coloreStato(stato: StatoProposta): string {
    switch (stato) {
      case StatoProposta.ACCETTATA:
        return 'green';
      case StatoProposta.RIFIUTATA:
        return 'red';
      case StatoProposta.CONTROPROPOSTA:
        return 'blue';
      default:
        return 'orange';
    }
  }

  labelStato(stato: string): string {
    switch (stato) {
      case 'IN_ATTESA':
        return 'In attesa';
      case 'CONTROPROPOSTA':
        return 'Controproposta';
      case 'ACCETTATA':
        return 'Accettata';
      case 'RIFIUTATA':
        return 'Rifiutata';
      default:
        return stato;
    }
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
