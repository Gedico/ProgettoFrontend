import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InserzioneResponse} from '../../../models/inserzioneresponse';
import {InserzioneService} from '../../../services/inserzioni.service';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SessionService} from '../../../services/session.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PropostaService} from '../../../services/proposta.service';
import Swal from 'sweetalert2';
import {CurrencyInputDirective} from '../../../shared/directives/currency-input.directive';
import {StatoProposta} from '../../../models/dto/enums/stato-proposta';

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
      prezzoProposta: [null, Validators.required],
      note: ['']
    });

    this.inserzioneService.getInserzioneById(this.id).subscribe({
      next: (data) => {
        this.inserzione = data;

        // Prezzo minimo = -15%
        this.prezzoMinimo = data.dati.prezzo * 0.85;

        this.offertaForm.get('prezzoProposta')?.setValidators([
          Validators.required,
          Validators.min(this.prezzoMinimo)
        ]);
        this.offertaForm.get('prezzoProposta')?.updateValueAndValidity();

        this.mappaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${data.posizione.latitudine},${data.posizione.longitudine}&z=15&output=embed`
        );

        // Carica eventuale controproposta agente
        this.caricaControproposta();

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

    const payload = {
      idInserzione: this.inserzione.id,
      prezzoProposta: this.offertaForm.value.prezzoProposta,
      note: this.offertaForm.value.note
    };

    this.propostaService.inviaProposta(payload).subscribe({
      next: () => {
        Swal.fire("Successo", "Proposta inviata!", "success").then(() => {});
        this.mostraFormOfferta = false;
        this.offertaForm.reset();
      },
      error: (err) => {
        Swal.fire("Errore", err?.error?.message || "Errore invio proposta.", "error").then(() => {});
      }
    });
  }

  caricaControproposta() {
    this.propostaService.getProposteUtente().subscribe({
      next: (res) => {
        const propostaUtente = res.find(
          (p: any) =>
            p.idInserzione === this.inserzione.id &&
            p.proponente === 'UTENTE' &&
            p.stato === 'IN_ATTESA'
        );

        this.contropropostaAgente = res.find(
          (p: any) =>
            p.idInserzione === this.inserzione.id &&
            p.proponente === 'AGENTE' &&
            p.stato === 'CONTROPROPOSTA'
        );

        // Stato centrale
        this.haTrattativaInCorso = !!propostaUtente || !!this.contropropostaAgente;
      }
    });
  }


  accettaControproposta() {
    Swal.fire({
      title: 'Confermi l’accettazione?',
      text: 'Accettando la controproposta l’inserzione verrà considerata venduta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sì, accetta',
      cancelButtonText: 'Annulla',
      confirmButtonColor: '#28a745'
    }).then(result => {
      if (result.isConfirmed) {
        this.propostaService.aggiornaStato(
          this.contropropostaAgente.idProposta,
          StatoProposta.ACCETTATA
        ).subscribe({
          next: () => {
            Swal.fire(
              'Accettata',
              'Hai accettato la controproposta.',
              'success'
            ).then(() => {});
            this.contropropostaAgente.stato = 'ACCETTATA';
            this.haTrattativaInCorso = false;
          },
          error: (err) => {
            Swal.fire(
              'Errore',
              err?.error?.message || 'Errore.',
              'error'
            ).then(() => {});
          }
        });
      }
    });
  }


  rifiutaControproposta() {
    Swal.fire({
      title: 'Rifiutare la controproposta?',
      text: 'Questa azione non potrà essere annullata.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì, rifiuta',
      cancelButtonText: 'Annulla',
      confirmButtonColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {
        this.propostaService.aggiornaStato(
          this.contropropostaAgente.idProposta,
          StatoProposta.RIFIUTATA
        ).subscribe({
          next: () => {
            Swal.fire(
              'Rifiutata',
              'Hai rifiutato la controproposta.',
              'info'
            ).then(() => {});
            this.contropropostaAgente.stato = 'RIFIUTATA';
            this.haTrattativaInCorso = false;
          },
          error: (err) => {
            Swal.fire(
              'Errore',
              err?.error?.message || 'Errore.',
              'error'
            ).then(() => {});
          }
        });
      }
    });
  }

  vaiAInserzione() {
    this.router.navigate(['/inserzioni', this.inserzione.id]).then(() => {});
  }

  isAgente(): boolean {
    const session = this.sessionService.getSnapshot();
    return session.logged && session.role === 'AGENTE';
  }

  vaiAPropostaManuale(): void {
    this.router.navigate(
      ['/inserzione', this.inserzione.id, 'proposta-manuale']
    ).then(() => {});
  }


}
