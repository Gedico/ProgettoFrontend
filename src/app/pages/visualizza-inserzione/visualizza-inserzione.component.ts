import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InserzioneResponse } from '../../models/inserzioneresponse';
import { InserzioneService } from '../../services/inserzioni.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SessionService } from '../../services/session.service';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropostaService } from '../../services/proposta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualizza-inserzione',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, ReactiveFormsModule],
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

    // Inizializza il form
    this.offertaForm = this.fb.group({
      prezzoProposta: ['', Validators.required],
      note: ['']
    });

    // Carica i dati dell’inserzione
    this.inserzioneService.getInserzioneById(this.id).subscribe({
      next: (data) => {
        this.inserzione = data;

        // Prezzo minimo consentito (-15%)
        this.prezzoMinimo = data.dati.prezzo * 0.85;

        this.offertaForm.get('prezzoProposta')?.setValidators([
          Validators.required,
          Validators.min(this.prezzoMinimo)
        ]);
        this.offertaForm.get('prezzoProposta')?.updateValueAndValidity();

        // Mappa
        this.mappaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${data.posizione.latitudine},${data.posizione.longitudine}&z=15&output=embed`
        );

        this.caricamento = false;
      },
      error: (err) => {
        console.error("Errore caricamento inserzione:", err);
        this.caricamento = false;
      }
    });
  }

  get prezzoProposta() {
    return this.offertaForm.get('prezzoProposta');
  }

  toggleFormOfferta() {
    const session = this.sessionService.getSnapshot();

    // 🔒 UTENTE NON LOGGATO → Mostra popup + redirect
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

    // 🔓 Utente loggato → Mostra form
    this.mostraFormOfferta = !this.mostraFormOfferta;
  }

  inviaProposta() {
    if (this.offertaForm.invalid) {
      this.offertaForm.markAllAsTouched();
      return;
    }

    const request = {
      idInserzione: this.inserzione.id,
      prezzoProposta: this.offertaForm.value.prezzoProposta,
      note: this.offertaForm.value.note
    };

    this.propostaService.inviaProposta(request).subscribe({
      next: (res) => {
        Swal.fire(
          "Successo!",
          res.messaggio || "Proposta inviata con successo.",
          "success"
        ).then(() => {});

        this.mostraFormOfferta = false;
        this.offertaForm.reset();
      },
      error: (err) => {
        Swal.fire(
          "Errore",
          err.error?.message || "Impossibile inviare proposta",
          "error"
        ).then(() => {});
      }
    });
  }
}
