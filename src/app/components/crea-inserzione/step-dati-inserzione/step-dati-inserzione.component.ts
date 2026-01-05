import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-dati-inserzione',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-dati-inserzione.component.html',
  styleUrls: ['./step-dati-inserzione.component.css']
})
export class StepDatiInserzioneComponent {

  @Input() datiInserzioneForm!: FormGroup;

  @Output() avanti = new EventEmitter<void>();
  @Output() indietro = new EventEmitter<void>();
  @Output() prezzoInput = new EventEmitter<Event>();
  @Output() prezzoBlur = new EventEmitter<void>();

  /**
   * Campi obbligatori da validare
   */
  private readonly campiObbligatori = [
    'titolo',
    'descrizione',
    'prezzo',
    'dimensioni',
    'numeroStanze',
    'classeEnergetica',
    'categoria'
  ];

  /**
   * Calcola quanti campi obbligatori sono stati compilati
   */
  getFilledFieldsCount(): number {
    let count = 0;

    this.campiObbligatori.forEach(campo => {
      const control = this.datiInserzioneForm.get(campo);
      if (control && control.value) {
        // Per i campi numerici, verifica che siano > 0
        if (typeof control.value === 'number') {
          if (control.value > 0) count++;
        } else if (typeof control.value === 'string') {
          if (control.value.trim().length > 0) count++;
        }
      }
    });

    // Piano è opzionale, quindi non conta
    return count;
  }

  /**
   * Calcola la percentuale di completamento
   */
  getProgressPercentage(): number {
    const totalFields = this.campiObbligatori.length;
    const filledFields = this.getFilledFieldsCount();
    return Math.round((filledFields / totalFields) * 100);
  }
}
