import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InserzioneService } from '../../../services/inserzioni.service';
import {InserzioneRequest} from '../../../models/dto/inserzioni/inserzionerequest';

@Component({
  selector: 'app-nuova-inserzione',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nuova-inserzione.component.html',
  styleUrls: ['./nuova-inserzione.component.css']
})
export class NuovaInserzioneComponent implements OnInit {

  form!: FormGroup;
  immagini: File[] = [];

  constructor(
    private fb: FormBuilder,
    private inserzioneService: InserzioneService
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({

      /* ------------------ DATI INSERZIONE ------------------ */
      titolo: ['', Validators.required],
      descrizione: ['', Validators.required],
      prezzo: [null, [Validators.required, Validators.min(1)]],
      dimensioni: [null, [Validators.required, Validators.min(1)]],
      numero_stanze: [null, [Validators.required, Validators.min(1)]],
      piano: [null],
      ascensore: [false],
      classe_energetica: ['', Validators.required],
      categoria: ['', Validators.required],

      /* ------------------ POSIZIONE ------------------ */
      latitudine: [null, Validators.required],
      longitudine: [null, Validators.required],
      descrizione_posizione: ['', Validators.required]

    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    this.immagini = [];

    for (let i = 0; i < files.length; i++) {
      this.immagini.push(files[i]);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      console.warn("Form non valido");

      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        console.log(
          key,
          'value:', control?.value,
          'valid:', control?.valid,
          'errors:', control?.errors
        );
      });

      return;
    }



  // 1. Costruzione della DTO annidata identica al backend
    const request: InserzioneRequest = <InserzioneRequest>{
      datiInserzioneRequest: {
        titolo: this.form.value.titolo,
        descrizione: this.form.value.descrizione,
        prezzo: this.form.value.prezzo,
        dimensioni: this.form.value.dimensioni,
        numero_stanze: this.form.value.numero_stanze,
        piano: this.form.value.piano,
        ascensore: this.form.value.ascensore,
        classe_energetica: this.form.value.classe_energetica,
        categoria: this.form.value.categoria
      },
      posizione: {
        latitudine: this.form.value.latitudine,
        longitudine: this.form.value.longitudine,
        descrizione_posizione: this.form.value.descrizione_posizione
      }
    };

    // 2. Chiamata al service → il service crea già FormData + aggiunge immagini
    this.inserzioneService.creaInserzione(request, this.immagini)
      .subscribe({
        next: (res) => {
          console.log("Inserzione creata:", res);
          alert("Inserzione creata con successo!");
        },
        error: (err) => {
          console.error("Errore creazione:", err);
          alert("Errore nella creazione dell'inserzione");
        }
      });
  }



}
