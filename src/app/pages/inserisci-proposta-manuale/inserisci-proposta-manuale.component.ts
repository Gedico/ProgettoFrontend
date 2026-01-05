import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, finalize } from 'rxjs';
import Swal from 'sweetalert2';

import { PropostaService } from '../../services/proposta.service';
import { CurrencyInputDirective } from '../../shared/directives/currency-input.directive';

@Component({
  selector: 'app-inserisci-proposta-manuale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyInputDirective],
  templateUrl: './inserisci-proposta-manuale.component.html',
  styleUrls: ['./inserisci-proposta-manuale.component.css']
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
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idInserzione = Number(idParam);

    if (!idParam || isNaN(this.idInserzione)) {
      this.router.navigate(['/']);
      return;
    }

    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      prezzoProposta: [null, [Validators.required, Validators.min(1)]],
      nomeCliente: ['', [Validators.required, Validators.minLength(2)]],
      contattoCliente: ['', [Validators.required, Validators.minLength(5)]],
      note: ['', [Validators.maxLength(500)]],
      dataOfferta: [new Date().toISOString().substring(0, 10), [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.propostaService.creaPropostaManuale(this.idInserzione, this.form.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => this.showFeedback('Successo!', 'Offerta registrata.', 'success'),
        error: (err) => this.showFeedback('Errore', err?.error?.message || 'Riprova più tardi', 'error')
      });
  }

  private showFeedback(title: string, text: string, icon: 'success' | 'error'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#6366f1',
      heightAuto: false,
      customClass: { popup: 'modern-swal' }
    }).then(() => {
      if (icon === 'success') this.router.navigate(['/inserzioni', this.idInserzione]);
    });
  }

  annulla(): void {
    if (this.form.dirty) {
      Swal.fire({
        title: 'Abbandonare le modifiche?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sì, esci',
        cancelButtonText: 'Resta qui',
        confirmButtonColor: '#ef4444'
      }).then(res => { if (res.isConfirmed) this.router.navigate(['/inserzioni', this.idInserzione]); });
    } else {
      this.router.navigate(['/inserzioni', this.idInserzione]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
