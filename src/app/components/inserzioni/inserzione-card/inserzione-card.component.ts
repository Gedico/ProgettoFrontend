import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { InserzioneCard } from '../../../models/inserzionecard';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inserzione-card',
  standalone: true,
  imports: [CurrencyPipe, RouterModule /*, NgIf*/],
  templateUrl: './inserzione-card.component.html',
  styleUrls: ['./inserzione-card.component.css']
})
export class InserzioneCardComponent {
  @Input() inserzione!: InserzioneCard;
}

