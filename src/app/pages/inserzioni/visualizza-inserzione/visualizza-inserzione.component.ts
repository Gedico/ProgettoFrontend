import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { InserzioneService } from '../../../services/inserzioni.service';
import { PropostaService } from '../../../services/proposta.service';
import { SessionService } from '../../../services/session.service';
import { InserzioneResponse } from '../../../models/inserzioneresponse';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';
import { StatoProposta } from '../../../models/dto/enums/stato-proposta';

@Component({
  selector: 'app-visualizza-inserzione',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, CurrencyInputDirective],
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
  haTrattativaInCorso = false;
  contropropostaAgente: any = null;

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
      prezzoProposta: [null, [Validators.required, Validators.min(1)]],
      note: ['', Validators.maxLength(500)]
    });

    this.inserzioneService.getInserzioneById(this.id).subscribe({
      next: data => {
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

        this.caricaControproposta();
        this.caricamento = false;
      },
      error: () => this.caricamento = false
    });
  }

  get prezzoProposta() {
    return this.offertaForm.get('prezzoProposta');
  }

  isUtente(): boolean {
    const s = this.sessionService.getSnapshot();
    return s.logged && s.role === 'UTENTE';
  }

  isAgente(): boolean {
    const s = this.sessionService.getSnapshot();
    return s.logged && s.role === 'AGENTE';
  }

  toggleFormOfferta() {
    const session = this.sessionService.getSnapshot();

    if (!session.logged) {
      this.mostraAlertLogin();
      return;
    }

    if (session.role !== 'UTENTE') {
      Swal.fire(
        'Operazione non consentita',
        'Solo gli utenti possono inviare offerte.',
        'info'
      );
      return;
    }

    this.mostraFormOfferta = !this.mostraFormOfferta;
  }

  private mostraAlertLogin() {
    Swal.fire({
      title: 'Accesso richiesto',
      text: 'Devi essere registrato per inviare una proposta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Accedi',
      cancelButtonText: 'Annulla',
      confirmButtonColor: '#0f2a44'
    }).then(r => {
      if (r.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }

  inviaProposta() {
    if (this.offertaForm.invalid) return;

    const payload = {
      idInserzione: this.inserzione.id,
      prezzoProposta: this.offertaForm.value.prezzoProposta,
      note: this.offertaForm.value.note
    };

    this.propostaService.inviaProposta(payload).subscribe({
      next: () => {
        Swal.fire('Successo', 'Proposta inviata!', 'success');
        this.mostraFormOfferta = false;
        this.offertaForm.reset();
      },
      error: err =>
        Swal.fire('Errore', err?.error?.message || 'Errore invio proposta.', 'error')
    });
  }

  caricaControproposta() {
    this.propostaService.getProposteUtente().subscribe(res => {
      this.contropropostaAgente = res.find(
        (p: any) =>
          p.idInserzione === this.inserzione.id &&
          p.proponente === 'AGENTE' &&
          p.stato === 'CONTROPROPOSTA'
      );

      this.haTrattativaInCorso = !!this.contropropostaAgente;
    });
  }

  accettaControproposta() {
    this.propostaService.aggiornaStato(
      this.contropropostaAgente.idProposta,
      StatoProposta.ACCETTATA
    ).subscribe(() => this.caricaControproposta());
  }

  rifiutaControproposta() {
    this.propostaService.aggiornaStato(
      this.contropropostaAgente.idProposta,
      StatoProposta.RIFIUTATA
    ).subscribe(() => this.caricaControproposta());
  }

  vaiAPropostaManuale() {
    this.router.navigate(['/inserzione', this.inserzione.id, 'proposta-manuale']);
  }
}
