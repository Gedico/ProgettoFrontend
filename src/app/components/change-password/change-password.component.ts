import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

  constructor(
    private fb: FormBuilder,
    private profiloService: ProfiloService
  ) {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

   passwordMatchValidator(group: FormGroup) {
    const pwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pwd === confirm ? null : { passwordMismatch: true };
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { oldPassword, newPassword } = this.form.value;

    this.profiloService.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();

        Swal.fire(
          'Password aggiornata',
          'La password è stata modificata con successo.',
          'success'
        );
      },
      error: err => {
        this.loading = false;

        Swal.fire(
          'Errore',
          err?.error?.message || 'Errore durante il cambio password.',
          'error'
        );
      }
    });
  }
}
