import { Component, HostListener, OnInit } from '@angular/core';
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

import { InserzioneService } from '../../../services/inserzioni.service';
import { PropostaService } from '../../../services/proposta.service';
import { SessionService } from '../../../services/session.service';
import { InserzioneResponse } from '../../../models/inserzioneresponse';
import { CurrencyInputDirective } from '../../../shared/directives/currency-input.directive';
import { StatoProposta } from '../../../models/dto/enums/stato-proposta';
import { UiPopupService } from '../../../shared/ui/ui-popup.service';

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
  indiceFotoCorrente: number = 0;

  haTrattativaInCorso = false;
  contropropostaAgente: ContropropostaAgente | null = null;

  // session flags
  isLogged = false;
  role: Ruolo | null = null;
  isUtenteRole = false;
  isAgenteRole = false;
  isAdminRole = false;

  // UX submit
  invioInCorso = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly inserzioneService: InserzioneService,
    private readonly sanitizer: DomSanitizer,
    private readonly fb: FormBuilder,
    private readonly propostaService: PropostaService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly popup: UiPopupService
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

  /* =========================================================
     Keyboard: ESC chiude la modale
     ========================================================= */
  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.mostraFormOfferta) {
      this.chiudiFormOfferta();
    }
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
        error: async () => {
          await this.popup.error('Errore', 'Impossibile caricare l’inserzione.');
        }
      });
  }

  private setupFromInserzione(data: InserzioneResponse): void {
    // prezzo minimo (85% del prezzo)
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

  // getter tipizzato
  get prezzoProposta(): AbstractControl | null {
    return this.offertaForm.get('prezzoProposta');
  }

  /* =========================================================
     MODAL: apertura/chiusura (con scroll lock)
     ========================================================= */

  toggleFormOfferta(): void {
    if (!this.isLogged) {
      void this.mostraAlertLogin();
      return;
    }

    if (!this.isUtenteRole) {
      void this.popup.info('Operazione non consentita', 'Solo gli utenti possono inviare offerte.');
      return;
    }

    if (this.haTrattativaInCorso) {
      void this.popup.info('Trattativa già presente', 'Hai già una trattativa in corso per questa inserzione.');
      return;
    }

    this.mostraFormOfferta = !this.mostraFormOfferta;
    document.body.classList.toggle('no-scroll', this.mostraFormOfferta);

    if (!this.mostraFormOfferta) {
      this.resetOffertaForm();
    }
  }

  chiudiFormOfferta(): void {
    this.mostraFormOfferta = false;
    document.body.classList.remove('no-scroll');
    this.resetOffertaForm();
  }

  private resetOffertaForm(): void {
    this.offertaForm.reset();
    this.invioInCorso = false;
  }

  /* =========================================================
     LOGIN CTA
     ========================================================= */
  async mostraAlertLogin(): Promise<void> {
    const go = await this.popup.confirm({
      title: 'Accesso richiesto',
      text: 'Devi essere registrato per inviare una proposta.',
      confirmText: 'Accedi',
      cancelText: 'Annulla'
    });

    if (go) {
      void this.router.navigate(['/login']);
    }
  }

  /* =========================================================
     INVIO PROPOSTA (con confirm + popup)
     ========================================================= */
  async inviaProposta(): Promise<void> {
    if (!this.inserzione) return;
    if (!this.isUtenteRole) return;

    if (this.offertaForm.invalid || this.invioInCorso) {
      this.offertaForm.markAllAsTouched();
      await this.popup.warning('Dati non validi', 'Controlla l’importo inserito prima di inviare.');
      return;
    }

    const ok = await this.popup.confirm({
      title: 'Inviare la proposta?',
      text: 'Confermi l’invio della tua proposta all’agente?',
      confirmText: 'Invia',
      cancelText: 'Annulla'
    });

    if (!ok) return;

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
        next: async () => {
          const goToList = await this.popup.confirm({
            title: 'Successo',
            text: 'Proposta inviata! Vuoi andare alle tue proposte?',
            confirmText: 'Vai alle mie proposte',
            cancelText: 'Chiudi'
          });

          if (goToList) {
            void this.router.navigate(['/proposte-inviate']);
          }

          this.chiudiFormOfferta();
        },
        error: async (err) => {
          const msg = err?.error?.message || 'Errore invio proposta.';
          await this.popup.error('Errore', msg);
        }
      });
  }

  /* =========================================================
     CONTROPROPOSTA
     ========================================================= */

  private caricaControproposta(): void {
    if (!this.inserzione) return;

    this.propostaService.getProposteUtente().subscribe({
      next: (res: ContropropostaAgente[]) => {
        const found = res.find(
          (p) =>
            p.idInserzione === this.inserzione!.id &&
            p.proponente === 'AGENTE' &&
            p.stato === 'CONTROPROPOSTA'
        );

        this.contropropostaAgente = found ?? null;
        this.haTrattativaInCorso = Boolean(this.contropropostaAgente);
      },
      error: async () => {
        // non blocchiamo la pagina: solo warn
        await this.popup.warning('Attenzione', 'Non è stato possibile caricare la controproposta.');
      }
    });
  }

  async accettaControproposta(): Promise<void> {
    if (!this.contropropostaAgente) return;

    const ok = await this.popup.confirm({
      title: 'Accettare la controproposta?',
      text: 'Confermi di accettare la controproposta dell’agente?',
      confirmText: 'Accetta',
      cancelText: 'Annulla'
    });

    if (!ok) return;

    this.propostaService
      .aggiornaStato(this.contropropostaAgente.idProposta, StatoProposta.ACCETTATA)
      .subscribe({
        next: () => this.caricaControproposta(),
        error: async () => {
          await this.popup.error('Errore', 'Impossibile accettare la controproposta.');
        }
      });
  }

  async rifiutaControproposta(): Promise<void> {
    if (!this.contropropostaAgente) return;

    const ok = await this.popup.confirm({
      title: 'Rifiutare la controproposta?',
      text: 'Confermi di rifiutare la controproposta dell’agente?',
      confirmText: 'Rifiuta',
      cancelText: 'Annulla',
      danger: true
    });

    if (!ok) return;

    this.propostaService
      .aggiornaStato(this.contropropostaAgente.idProposta, StatoProposta.RIFIUTATA)
      .subscribe({
        next: () => this.caricaControproposta(),
        error: async () => {
          await this.popup.error('Errore', 'Impossibile rifiutare la controproposta.');
        }
      });
  }

  /* =========================================================
     ROUTE: proposta manuale
     ========================================================= */
  vaiAPropostaManuale(): void {
    if (!this.inserzione) return;
    if (!this.isAgenteRole) return;

    void this.router.navigate(['/inserzione', this.inserzione.id, 'proposta-manuale']);
  }




  nextFoto(): void {
  if (!this.inserzione?.foto?.length) return;

  this.indiceFotoCorrente =
    (this.indiceFotoCorrente + 1) % this.inserzione.foto.length;
}

prevFoto(): void {
  if (!this.inserzione?.foto?.length) return;

  this.indiceFotoCorrente =
    (this.indiceFotoCorrente - 1 + this.inserzione.foto.length) %
    this.inserzione.foto.length;
}

vaiAFoto(index: number): void {
  if (!this.inserzione?.foto?.length) return;

  this.indiceFotoCorrente = index;
}



}
