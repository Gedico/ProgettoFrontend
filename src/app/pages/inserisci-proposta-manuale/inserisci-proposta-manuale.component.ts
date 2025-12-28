import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { PropostaService } from '../../services/proposta.service';
import { PropostaManualeRequest } from '../../models/dto/proposta/proposta-manuale-request.dto';
import { CurrencyInputDirective } from '../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-inserisci-proposta-manuale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CurrencyInputDirective],
  templateUrl: 'inserisci-proposta-manuale.component.html',
  styleUrls: ['inserisci-proposta-manuale.component.css']
})
export class InserisciPropostaManualeComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  idInserzione!: number;
  isSubmitting = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly propostaService: PropostaService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initializeIdInserzione();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inizializza l'ID dell'inserzione dalla route
   */
  private initializeIdInserzione(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.handleError('ID inserzione non trovato');
      this.navigateToHome();
      return;
    }

    this.idInserzione = Number(idParam);

    if (isNaN(this.idInserzione) || this.idInserzione <= 0) {
      this.handleError('ID inserzione non valido');
      this.navigateToHome();
    }
  }

  /**
   * Inizializza il form reattivo con validazioni
   */
  private initializeForm(): void {
    const today = new Date().toISOString().substring(0, 10);

    this.form = this.fb.group({
      prezzoProposta: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(999999999)
        ]
      ],
      nomeCliente: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      contattoCliente: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]
      ],
      note: [
        '',
        [Validators.maxLength(500)]
      ],
      dataOfferta: [
        today,
        [Validators.required]
      ]
    });
  }

  /**
   * Gestisce il submit del form
   */
  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: PropostaManualeRequest = this.form.value;

    this.propostaService
      .creaPropostaManuale(this.idInserzione, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => {
          this.handleError(err?.error?.message);
          this.isSubmitting = false;
        }
      });
  }

  /**
   * Gestisce l'annullamento del form
   */
  annulla(): void {
    if (this.form.dirty && !this.isSubmitting) {
      this.confirmCancel();
    } else {
      this.navigateBack();
    }
  }

  /**
   * Conferma l'annullamento se ci sono modifiche non salvate
   */
  private confirmCancel(): void {
    Swal.fire({
      title: 'Sei sicuro?',
      text: 'Le modifiche non salvate andranno perse',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sì, annulla',
      cancelButtonText: 'No, torna al form',
      backdrop: true,
      customClass: {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.navigateBack();
      }
    });
  }

  /**
   * Gestisce il successo dell'operazione
   */
  private handleSuccess(): void {
    Swal.fire({
      title: 'Successo!',
      text: 'Offerta manuale inserita correttamente',
      icon: 'success',
      confirmButtonColor: '#667eea',
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: true,
      customClass: {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-confirm'
      }
    }).then(() => {
      this.isSubmitting = false;
      this.navigateBack();
    });
  }

  /**
   * Gestisce gli errori
   */
  private handleError(message?: string): void {
    Swal.fire({
      title: 'Errore',
      text: message || 'Si è verificato un errore durante l\'operazione',
      icon: 'error',
      confirmButtonColor: '#667eea',
      customClass: {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-confirm'
      }
    });
  }

  /**
   * Naviga alla pagina dell'inserzione
   */
  private navigateBack(): void {
    this.router.navigate(['/inserzioni', this.idInserzione]);
  }

  /**
   * Naviga alla home in caso di errori critici
   */
  private navigateToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Marca tutti i campi come touched per mostrare gli errori
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }
}
