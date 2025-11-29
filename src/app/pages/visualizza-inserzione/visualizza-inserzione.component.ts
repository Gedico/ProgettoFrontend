import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InserzioneResponse } from '../../models/inserzioneresponse';
import { InserzioneService } from '../../services/inserzioni.service';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropostaService } from '../../services/proposta.service';
import Swal from 'sweetalert2';
import { SessionService } from '../../services/session.service';

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

  isLogged = false;
  isUtente = false;

  constructor(
    private route: ActivatedRoute,
    private inserzioneService: InserzioneService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private propostaService: PropostaService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {

    // Stato autenticazione
    this.sessionService.session$.subscribe(s => {
      this.isLogged = s.logged;
      this.isUtente = s.role === 'UTENTE';
    });

    // Form
    this.offertaForm = this.fb.group({
      prezzoProposta: ['', [Validators.required]],
      note: ['']
    });

    // Inserzione
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.inserzioneService.getInserzioneById(this.id).subscribe({
      next: (data) => {
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
      }
    });
  }

  get prezzoProposta() {
    return this.offertaForm.get('prezzoProposta');
  }

  toggleFormOfferta() {

    if (!this.isLogged) {
      Swal.fire({
        icon: "info",
        title: "Accesso richiesto",
        text: "Solo gli utenti registrati possono inviare una proposta.",
        showCancelButton: true,
        confirmButtonText: "Accedi",
        cancelButtonText: "Chiudi"
      }).then(r => {
        if (r.isConfirmed) window.location.href = "/login";
      });
      return;
    }

    if (!this.isUtente) {
      Swal.fire({
        icon: "warning",
        title: "Operazione non consentita",
        text: "Solo gli utenti possono fare offerte."
      });
      return;
    }

    this.mostraFormOfferta = true;
  }

  chiudiModal() {
    const modal = document.querySelector('.modal-card');
    if (modal) {
      modal.classList.add('closing');

      setTimeout(() => {
        this.mostraFormOfferta = false;
      }, 180);
    }
  }

  inviaProposta() {
    if (this.offertaForm.invalid) {
      this.offertaForm.markAllAsTouched();
      return;
    }

    const req = {
      idInserzione: this.inserzione.id,
      prezzoProposta: this.offertaForm.value.prezzoProposta,
      note: this.offertaForm.value.note
    };

    this.propostaService.inviaProposta(req).subscribe({
      next: (res) => {
        Swal.fire("Successo!", res.messaggio || "Proposta inviata!", "success");
        this.mostraFormOfferta = false;
        this.offertaForm.reset();
      },
      error: (err) => {
        Swal.fire("Errore", err.error?.message || "Impossibile inviare proposta", "error");
      }
    });
  }
}
