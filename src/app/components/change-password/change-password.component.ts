import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ProfiloService } from '../../services/profilo.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;

  // toggles UI
  showOld = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private profiloService: ProfiloService
  ) {
    this.form = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: ChangePasswordComponent.passwordMatchValidator }
    );
  }

  static passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!pwd || !confirm) return null;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  get oldPassword() { return this.form.get('oldPassword'); }
  get newPassword() { return this.form.get('newPassword'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  toggle(which: 'old' | 'new' | 'confirm'): void {
    if (which === 'old') this.showOld = !this.showOld;
    if (which === 'new') this.showNew = !this.showNew;
    if (which === 'confirm') this.showConfirm = !this.showConfirm;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const oldPassword = String(this.oldPassword?.value ?? '');
    const newPassword = String(this.newPassword?.value ?? '');

    this.loading = true;

    this.profiloService.changePassword(oldPassword, newPassword)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.form.reset();
          this.showOld = this.showNew = this.showConfirm = false;

          Swal.fire('Password aggiornata', 'La password è stata modificata con successo.', 'success');
        },
        error: (err) => {
          Swal.fire(
            'Errore',
            err?.error?.message || 'Errore durante il cambio password.',
            'error'
          );
        }
      });
  }
}
