import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-immagini',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-immagini.component.html',
  styleUrls: ['./step-immagini.component.css']
})
export class StepImmaginiComponent {

  @Input() anteprime: string[] = [];
  @Input() immaginiCount = 0;

  @Output() fileSelezionati = new EventEmitter<Event>();
  @Output() rimuovi = new EventEmitter<number>();
  @Output() indietro = new EventEmitter<void>();
  @Output() pubblica = new EventEmitter<void>();
}

