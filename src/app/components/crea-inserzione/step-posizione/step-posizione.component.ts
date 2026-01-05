import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

declare const google: any;

@Component({
  selector: 'app-step-posizione',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-posizione.component.html',
  styleUrls: ['./step-posizione.component.css']
})
export class StepPosizioneComponent {

  @ViewChild('indirizzoInput') indirizzoInput!: ElementRef<HTMLInputElement>;

  @Input() posizioneForm!: FormGroup;
  @Input() nomiComuni: string[] = [];
  @Input() comuniFiltrati: string[] = [];

  @Output() nextStep = new EventEmitter<void>();
  @Output() comuneSelezionato = new EventEmitter<void>();
  @Output() comuneInput = new EventEmitter<string>();
  @Output() selezionaComune = new EventEmitter<string>();
  @Output() comuneChange = new EventEmitter<string>();
  @Output() posizioneSelezionata = new EventEmitter<{
    lat: number;
    lng: number;
    indirizzo: string;
  }>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.posizioneForm.get('comune')!
      .valueChanges
      .subscribe(value => {
        this.comuneChange.emit(value ?? '');
      });
  }

  ngAfterViewInit(): void {
    // Verifica che siamo nel browser e che Google Maps sia caricato
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.indirizzoInput || typeof google === 'undefined') {
      console.warn('Google Maps non è ancora caricato');
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(
      this.indirizzoInput.nativeElement,
      {
        types: ['address'],
        componentRestrictions: { country: 'it' }
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const indirizzo = place.formatted_address ?? '';

      // source of truth: FormGroup
      this.posizioneForm.patchValue({
        indirizzo,
        latitudine: lat,
        longitudine: lng
      });

      // comunicazione verso il container
      this.posizioneSelezionata.emit({
        lat,
        lng,
        indirizzo
      });
    });
  }

  /**
   * Calcola quanti campi sono stati compilati
   */
  getFilledFieldsCount(): number {
    let count = 0;

    if (this.posizioneForm.get('comune')?.value) count++;
    if (this.posizioneForm.get('indirizzo')?.value) count++;

    return count;
  }

  /**
   * Calcola la percentuale di completamento
   */
  getProgressPercentage(): number {
    const totalFields = 2;
    const filledFields = this.getFilledFieldsCount();
    return (filledFields / totalFields) * 100;
  }
}
