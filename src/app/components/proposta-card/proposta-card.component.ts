import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PropostaResponse } from '../../models/dto/proposta/proposta-response.dto';

@Component({
  selector: 'app-proposta-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proposta-card.component.html',
  styleUrls: ['./proposta-card.component.css']
})
export class PropostaCardComponent {
  @Input({ required: true }) proposta!: PropostaResponse;

  /** classi aggiuntive per stile: "attiva", "accettata", "rifiutata", "controproposta" */
  @Input() variant: 'attiva' | 'accettata' | 'rifiutata' | 'controproposta' | 'default' = 'default';

  /** Mostra i bottoni Accetta/Rifiuta (solo nel caso controproposta) */
  @Input() showActions = false;

  /** Mostra il bottone "Vedi inserzione" */
  @Input() showDetails = true;

  @Output() accept = new EventEmitter<PropostaResponse>();
  @Output() reject = new EventEmitter<PropostaResponse>();

  onAccept(): void {
    this.accept.emit(this.proposta);
  }

  onReject(): void {
    this.reject.emit(this.proposta);
  }

  labelStato(stato: string): string {
    switch (stato) {
      case 'IN_ATTESA': return 'In attesa';
      case 'CONTROPROPOSTA': return 'Controproposta';
      case 'ACCETTATA': return 'Accettata';
      case 'RIFIUTATA': return 'Rifiutata';
      default: return stato;
    }
  }

  badgeClass(stato: string): string {
    // usiamo classi già presenti nel tuo CSS: in_attesa/accettata/rifiutata + badge-controproposta
    switch (stato) {
      case 'IN_ATTESA': return 'in_attesa';
      case 'ACCETTATA': return 'accettata';
      case 'RIFIUTATA': return 'rifiutata';
      case 'CONTROPROPOSTA': return 'badge-controproposta';
      default: return '';
    }
  }
}
