import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ComuneDTO} from '../../models/dto/comune/comunedto';
import { HttpClient } from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {NominatimResult} from '../../models/dto/indirizzi/nominatimresult';
import {StepMappaComponent} from './step-mappa/step-mappa.component';
import {InserzioneRequest} from '../../models/dto/inserzioni/inserzionerequest';
import {InserzioneService} from '../../services/inserzioni.service';
import { Router } from '@angular/router';
import {StepPosizioneComponent} from './step-posizione/step-posizione.component';
import {StepDatiInserzioneComponent} from './step-dati-inserzione/step-dati-inserzione.component';
import {StepImmaginiComponent} from './step-immagini/step-immagini.component';
import { ProgressBarComponent} from './progress-bar/progress-bar.component';
import { UiPopupService } from '../../shared/ui/ui-popup.service';





@Component({
  standalone: true,
  selector: 'app-crea-inserzione',
  templateUrl: './crea-inserzione.component.html',
  styleUrls: ['./crea-inserzione.component.css'],
  imports: [CommonModule,
    ReactiveFormsModule,
  StepMappaComponent,
  StepPosizioneComponent,
  StepDatiInserzioneComponent,
  StepImmaginiComponent,
  ProgressBarComponent]
})
export class CreaInserzioneComponent implements OnInit {

  stepCorrente: number = 1;
  totaleStep: number = 4;
  comuni: ComuneDTO[] = [];
  nomiComuni: string[] = [];
  indirizziSuggeriti: NominatimResult[] = [];
  immagini: File[] = [];
  anteprime: string[] = [];
  comuniFiltrati: string[] = [];


  creaInserzioneForm!: FormGroup;


  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private inserzioneService: InserzioneService,
              private router: Router,
              private uiPopup: UiPopupService
            ) {}



  ngOnInit(): void {

    this.creaInserzioneForm = this.fb.group({

      posizione: this.fb.group({
        comune: ['', Validators.required],

        // indirizzo disabilitato all'inizio (BEST PRACTICE)
        indirizzo: [{ value: '', disabled: true }, Validators.required],

        latitudine: [null],
        longitudine: [null]
      }),

      datiInserzione: this.fb.group({
        titolo: ['', Validators.required],
        descrizione: ['', Validators.required],
        prezzo: [null, [Validators.required, Validators.min(1)]],
        dimensioni: [null, [Validators.required, Validators.min(1)]],
        numeroStanze: [null, [Validators.required, Validators.min(1)]],
        piano: [null],
        ascensore: [false],
        classeEnergetica: ['', Validators.required],
        categoria: ['', Validators.required]
      })

    });


    this.caricaComuni();

  }



  get posizioneForm(): FormGroup {
    return this.creaInserzioneForm.get('posizione') as FormGroup;
  }

  get datiInserzioneForm(): FormGroup {
    return this.creaInserzioneForm.get('datiInserzione') as FormGroup;
  }


  /******************COMUNI****************************************************************************************************/


  private caricaComuni(): void {
    this.http.get<ComuneDTO[]>('/comuni.json')
      .subscribe({
        next: data => {
          this.comuni = data;
          this.nomiComuni = data.map(c => c.denominazione_ita);
        },
        error: err => console.error('Errore caricamento comuni', err)
      });
  }


  onComuneSelezionato(comune: string): void {
    this.posizioneForm.get('comune')?.setValue(comune);
    this.comuniFiltrati = [];
    this.posizioneForm.get('indirizzo')?.enable();
  }



  onComuneInput(value: string): void {
    if (!value || value.length < 3) {
      this.comuniFiltrati = [];
      return;
    }

    const v = value.toLowerCase();

    this.comuniFiltrati = this.nomiComuni
      .filter(c => c.toLowerCase().includes(v))
      .slice(0, 10); // max 10 risultati
  }



  /********PREZZO********************************************************************************************************************/

onPrezzoInput(event: Event): void {
  const input = event.target as HTMLInputElement;

  // rimuove tutto ciò che non è cifra
  const rawValue = input.value.replace(/\D/g, '');

  // aggiorna il form con NUMERO
  this.datiInserzioneForm.patchValue({
    prezzo: rawValue ? Number(rawValue) : null
  }, { emitEvent: false });

  // mostra il valore "pulito" mentre scrive
  input.value = rawValue;
}

  formatPrezzo(): void {
    const prezzo = this.datiInserzioneForm.get('prezzo')?.value;

    if (prezzo != null) {
      const formatted = prezzo.toLocaleString('it-IT');
      const input = document.querySelector<HTMLInputElement>('input[formControlName="prezzo"]');
      if (input) {
        input.value = formatted;
      }
    }
  }




  /*******INDIRIZZO*************************************************************************************************************/

  onPosizioneSelezionata(event: {
    lat: number;
    lng: number;
    indirizzo: string;
  }): void {

    this.posizioneForm.patchValue({
      indirizzo: event.indirizzo,
      latitudine: event.lat,
      longitudine: event.lng
    });

    // opzionale: pulizia suggerimenti vecchi
    this.indirizziSuggeriti = [];

    console.log('Posizione da Google Places:', event);
  }




  /*******IMMAGINI*********************************************************************************************************/



  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      this.immagini.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.anteprime.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    // reset input per permettere la stessa selezione
    input.value = '';
  }

  rimuoviImmagine(index: number): void {
    this.immagini.splice(index, 1);
    this.anteprime.splice(index, 1);
  }



/*********NAVIGAZIONE****************************************************************************************************/




  nextStep(): void {
    if (this.stepCorrente < this.totaleStep) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.stepCorrente++;
    }
  }

  previousStep(): void {
    if (this.stepCorrente > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.stepCorrente--;
    }
  }

  submit(): void {

  if (!this.creaInserzioneForm.valid) {
    return;
  }

  const dati = this.creaInserzioneForm.get('datiInserzione')?.value;
  const posizione = this.creaInserzioneForm.get('posizione')?.value;

  const request: InserzioneRequest = {
    datiInserzioneRequest: dati,
    posizione: posizione
  };

  this.inserzioneService.creaInserzione(request, this.immagini)
    .subscribe({
      next: async () => {
        await this.uiPopup.success(
          'Inserzione creata',
          'La tua inserzione è stata pubblicata con successo.'
        );

        this.router.navigate(['/agente/inserzioni']);
      },
      error: async (err) => {
        console.error('Errore creazione inserzione', err);

        await this.uiPopup.error(
          'Creazione non riuscita',
          'Si è verificato un errore durante la creazione dell’inserzione. Controlla i dati e riprova.'
        );

        // resta sull’ultimo step
        this.stepCorrente = this.totaleStep;
      }
    });

}


}

