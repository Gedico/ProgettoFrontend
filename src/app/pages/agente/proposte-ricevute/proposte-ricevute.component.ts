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
import {ContropropostaRequest} from '../../../models/dto/proposta/controproposta-request-dto';
import {parsePrezzo} from '../../../shared/utils/prezzo.utils';

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

  apriControproposta(proposta: PropostaResponse) {

    const prezzoUtente = proposta.importo;
    const prezzoInserzione = proposta.prezzoInserzione;

    Swal.fire({
      title: 'Invia controproposta',
      html: `
      <p>
        Offerta ricevuta:
        <b>${prezzoUtente.toLocaleString('it-IT')} €</b><br>
        Prezzo inserzione:
        <b>${prezzoInserzione.toLocaleString('it-IT')} €</b>
      </p>
    `,
      input: 'text',
      inputLabel: 'Nuovo prezzo',
      inputPlaceholder: 'Es. 2459000 oppure 2.459.000',
      showCancelButton: true,
      confirmButtonText: 'Invia',
      cancelButtonText: 'Annulla',

      preConfirm: (value) => {
        const prezzo = parsePrezzo(value);

        if (!prezzo) {
          Swal.showValidationMessage('Inserisci un importo valido');
          return;
        }

        if (prezzo <= prezzoUtente) {
          Swal.showValidationMessage(
            'La controproposta deve essere maggiore dell’offerta ricevuta'
          );
          return;
        }

        if (prezzo > prezzoInserzione) {
          Swal.showValidationMessage(
            'La controproposta non può superare il prezzo dell’inserzione'
          );
          return;
        }

        return prezzo;
      }
    }).then(result => {
      if (result.isConfirmed) {

        const request: ContropropostaRequest = {
          nuovoPrezzo: result.value
        };

        this.propostaService
          .creaControproposta(proposta.idProposta, request)
          .subscribe({
            next: () => {
              Swal.fire(
                'Inviata!',
                'Controproposta inviata con successo',
                'success'
              );
              this.caricaProposte();
            },
            error: err => {
              Swal.fire(
                'Errore',
                err?.error?.message || 'Errore durante l’invio della controproposta',
                'error'
              );
            }
          });
      }
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
