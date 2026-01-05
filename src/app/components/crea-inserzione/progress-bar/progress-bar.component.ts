import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {

  @Input() stepCorrente!: number;
  @Input() totaleStep!: number;

  // Etichette descrittive per ogni step
  stepLabels: string[] = [
    '📍 Posizione',
    '🗺️ Mappa',
    '📝 Dettagli',
    '📸 Immagini'
  ];

  isCompletato(step: number): boolean {
    return step <= this.stepCorrente;
  }
}
