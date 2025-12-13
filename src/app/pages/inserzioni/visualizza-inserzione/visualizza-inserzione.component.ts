import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InserzioneResponse } from '../../../models/inserzioneresponse';
import { InserzioneService } from '../../../services/inserzioni.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SessionService } from '../../../services/session.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropostaService } from '../../../services/proposta.service';
import Swal from 'sweetalert2';
import {CurrencyInputDirective} from '../../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-visualizza-inserzione',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, ReactiveFormsModule, CurrencyInputDirective],
  templateUrl: './visualizza-inserzione.component.html',
  styleUrls: ['./visualizza-inserzione.component.css']
})
export class VisualizzaInserzioneComponent implements OnInit {

  id!: number;
  inserzione!: InserzioneResponse;
  caricamento = true;

  mappaUrl!: SafeResourceUrl;

  mostraFormOfferta = false;
  offertaForm!: FormGroup;
  prezzoMinimo!: number;

  constructor(
    private route: ActivatedRoute,
    private inserzioneService: InserzioneService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private propostaService: PropostaService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.offertaForm = this.fb.group({
      prezzoProposta: [null, Validators.required],
      note: ['']
    });

    this.inserzioneService.getInserzioneById(this.id).subscribe({
      next: (data) => {
        console.log('INSERZIONE RAW:', data);
        console.log('PREZZO:', data?.dati?.prezzo);
        this.inserzione = data;

        this.prezzoMinimo = data.dati.prezzo * 0.85;

        this.offertaForm.get('prezzoProposta')?.setValidators([
          Validators.required,
          Validators.min(this.prezzoMinimo)
        ]);
        this.offertaForm.get('prezzoProposta')?.updateValueAndValidity();

        this.mappaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${data.posizione.latitudine},${data.posizione.longitudine}&z=15&output=embed`
        );

        this.caricamento = false;
      },
      error: () => {
        this.caricamento = false;
      }
    });
  }

  get prezzoProposta() {
    return this.offertaForm.get('prezzoProposta');
  }

  toggleFormOfferta() {
    const session = this.sessionService.getSnapshot();

    if (!session.logged) {
      Swal.fire({
        title: "Accesso richiesto",
        text: "Solo gli utenti registrati possono inviare proposte.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Accedi",
        cancelButtonText: "Annulla",
        confirmButtonColor: "#007bff"
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']).then(() => {});
        }
      });

      return;
    }

    this.mostraFormOfferta = !this.mostraFormOfferta;
  }

  inviaProposta() {
    if (this.offertaForm.invalid) return;

    const prezzo = this.offertaForm.value.prezzoProposta;

    if (prezzo < this.prezzoMinimo) {
      Swal.fire(
        "Errore",
        "La tua offerta è inferiore al minimo accettato.",
        "error"
      ).then(() => {});
      return;
    }

    const payload = {
      idInserzione: this.inserzione.id,
      prezzoProposta: prezzo,
      note: this.offertaForm.value.note
    };

    this.propostaService.inviaProposta(payload).subscribe({
      next: () => {
        Swal.fire("Successo", "Proposta inviata!", "success").then(() => {});
        this.toggleFormOfferta();
      },
      error: (err) => {
        Swal.fire(
          "Errore",
          err?.error?.message || "Errore invio proposta.",
          "error"
        ).then(() => {});
      }
    });
  }



}
