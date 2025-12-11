import { Component, Input } from '@angular/core';
import { CurrencyPipe} from '@angular/common';
import { InserzioneCard } from '../../../models/inserzionecard';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-inserzione-card',
  standalone: true,
  imports: [CurrencyPipe, RouterModule],
  templateUrl: './inserzione-card.component.html',
  styleUrls: ['./inserzione-card.component.css']
})
export class InserzioneCardComponent {
  /**
   * Dati sintetici dell'inserzione da visualizzare nella card.
   */
  @Input() inserzione!: InserzioneCard;

  /**
   * Rende la card cliccabile.
   */
  @Input() clickable: boolean = true;

  constructor(private readonly router: Router) {}

  /**
   * Restituisce l'immagine principale o un placeholder.
   */
  get foto(): string {
    return this.inserzione?.fotoPrincipale || 'assets/img/placeholder-home.jpg';
  }

  /**
   * Navigazione manuale (se clickable = true).
   */
  apriDettaglio(): void {
    if (!this.clickable || !this.inserzione?.idInserzione) {
      return;
    }
    this.router.navigate(['/inserzione', this.inserzione.idInserzione]);
  }
}

