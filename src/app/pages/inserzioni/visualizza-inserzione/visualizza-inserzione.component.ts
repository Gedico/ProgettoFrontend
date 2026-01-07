import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { InserzioneService } from '../../../services/inserzioni.service';
import { PropostaService } from '../../../services/proposta.service';
import { SessionService } from '../../../services/session.service';
import { InserzioneResponse } from '../../../models/inserzioneresponse';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';
import { StatoProposta } from '../../../models/dto/enums/stato-proposta';

type Ruolo = 'UTENTE' | 'AGENTE' | 'ADMIN';

interface SessionSnapshot {
  logged: boolean;
  role?: Ruolo;
}

interface ContropropostaAgente {
  idProposta: number;
  idInserzione: number;
  proponente: 'AGENTE' | 'UTENTE';
  stato: 'CONTROPROPOSTA' | string;
  importo: number;
  messaggio?: string | null;
}

@Component({
  selector: 'app-visualizza-inserzione',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, CurrencyInputDirective],
  templateUrl: './visualizza-inserzione.component.html',
  styleUrls: ['./visualizza-inserzione.component.css']
})
export class VisualizzaInserzioneComponent implements OnInit {
  id = 0;

  inserzione: InserzioneResponse | null = null;
  caricamento = true;

  mappaUrl: SafeResourceUrl | null = null;

  mostraFormOfferta = false;
  offertaForm: FormGroup;

  prezzoMinimo = 0;

  haTrattativaInCorso = false;
  contropropostaAgente: ContropropostaAgente | null = null;

  // session flags (centralizzati)
  isLogged = false;
  role: Ruolo | null = null;
  isUtenteRole = false;
  isAgenteRole = false;
  isAdminRole = false;

  // UX submit
  invioInCorso = false;

  constructor(
    private route: ActivatedRoute,
    private inserzioneService: InserzioneService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private propostaService: PropostaService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.offertaForm = this.fb.group({
      prezzoProposta: [null, [Validators.required, Validators.min(1)]],
      note: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;

    const session = this.sessionService.getSnapshot() as SessionSnapshot;
    this.isLogged = session.logged;
    this.role = session.role ?? null;

    this.isUtenteRole = this.isLogged && this.role === 'UTENTE';
    this.isAgenteRole = this.isLogged && this.role === 'AGENTE';
    this.isAdminRole = this.isLogged && this.role === 'ADMIN';

    this.caricaInserzione();
  }

  private caricaInserzione(): void {
    this.caricamento = true;

    this.inserzioneService
      .getInserzioneById(this.id)
      .pipe(finalize(() => (this.caricamento = false)))
      .subscribe({
        next: (data) => {
          this.inserzione = data;
          this.setupFromInserzione(data);

          if (this.isUtenteRole) {
            this.caricaControproposta();
          }
        },
        error: () => {
          Swal.fire('Errore', 'Impossibile caricare l’inserzione.', 'error');
        }
      });
  }

  /**
   * Imposta:
   * - prezzo minimo (85% del prezzo) + validator
   * - url mappa (se coordinate presenti)
   */
  private setupFromInserzione(data: InserzioneResponse): void {
    // prezzo minimo
    const prezzo = data?.dati?.prezzo;
    if (typeof prezzo === 'number' && prezzo > 0) {
      this.prezzoMinimo = prezzo * 0.85;

      const ctrl = this.offertaForm.get('prezzoProposta');
      ctrl?.setValidators([Validators.required, Validators.min(this.prezzoMinimo)]);
      ctrl?.updateValueAndValidity({ emitEvent: false });
    }

    // mappa
    const lat = data?.posizione?.latitudine;
    const lng = data?.posizione?.longitudine;

    if (lat != null && lng != null) {
      this.mappaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      );
    } else {
      this.mappaUrl = null;
    }
  }

  // getter tipizzato (utile nel template, evita warning e null crash)
  get prezzoProposta(): AbstractControl | null {
    return this.offertaForm.get('prezzoProposta');
  }

  /** Apertura/chiusura modale proposta con regole ruolo/login */
  toggleFormOfferta(): void {
    if (!this.isLogged) {
      this.mostraAlertLogin();
      return;
    }

    if (!this.isUtenteRole) {
      Swal.fire('Operazione non consentita', 'Solo gli utenti possono inviare offerte.', 'info');
      return;
    }

    if (this.haTrattativaInCorso) {
      Swal.fire('Trattativa già presente', 'Hai già una trattativa in corso per questa inserzione.', 'info');
      return;
    }

    this.mostraFormOfferta = !this.mostraFormOfferta;
  }

  /** CTA login (public perché potrebbe essere richiamata dal template) */
  mostraAlertLogin(): void {
    Swal.fire({
      title: 'Accesso richiesto',
      text: 'Devi essere registrato per inviare una proposta.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Accedi',
      cancelButtonText: 'Annulla',
      confirmButtonColor: '#0f2a44'
    }).then((r) => {
      if (r.isConfirmed) {
        this.router.navigate(['/login']);
      }
    });
  }

  inviaProposta(): void {
    if (!this.inserzione) return;
    if (!this.isUtenteRole) return;
    if (this.offertaForm.invalid || this.invioInCorso) return;

    this.invioInCorso = true;

    const payload = {
      idInserzione: this.inserzione.id,
      prezzoProposta: this.offertaForm.value.prezzoProposta,
      note: this.offertaForm.value.note
    };

    this.propostaService
      .inviaProposta(payload)
      .pipe(finalize(() => (this.invioInCorso = false)))
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Successo',
            text: 'Proposta inviata!',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Vai alle mie proposte',
            cancelButtonText: 'Chiudi',
            confirmButtonColor: '#0f2a44'
          }).then((res) => {
            if (res.isConfirmed) {
              this.router.navigate(['/proposte-inviate']);
            }
          });

          this.mostraFormOfferta = false;
          this.offertaForm.reset();
        },
        error: (err) => {
          Swal.fire('Errore', err?.error?.message || 'Errore invio proposta.', 'error');
        }
      });
  }

  /** Carica solo eventuale CONTROPROPOSTA dell’agente relativa a questa inserzione */
  private caricaControproposta(): void {
    if (!this.inserzione) return;

    this.propostaService.getProposteUtente().subscribe((res: ContropropostaAgente[]) => {
      const found = res.find(
        (p) =>
          p.idInserzione === this.inserzione!.id &&
          p.proponente === 'AGENTE' &&
          p.stato === 'CONTROPROPOSTA'
      );

      this.contropropostaAgente = found ?? null;
      this.haTrattativaInCorso = !!this.contropropostaAgente;
    });
  }

  accettaControproposta(): void {
    if (!this.contropropostaAgente) return;

    this.propostaService
      .aggiornaStato(this.contropropostaAgente.idProposta, StatoProposta.ACCETTATA)
      .subscribe(() => this.caricaControproposta());
  }

  rifiutaControproposta(): void {
    if (!this.contropropostaAgente) return;

    this.propostaService
      .aggiornaStato(this.contropropostaAgente.idProposta, StatoProposta.RIFIUTATA)
      .subscribe(() => this.caricaControproposta());
  }

  vaiAPropostaManuale(): void {
    if (!this.inserzione) return;
    if (!this.isAgenteRole) return;

    this.router.navigate(['/inserzione', this.inserzione.id, 'proposta-manuale']);
  }
}
