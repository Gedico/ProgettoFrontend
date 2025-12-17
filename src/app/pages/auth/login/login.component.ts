import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { ForgotPasswordComponent } from '../../../components/auth/forgot-password/forgot-password.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  /* ===================== LOGIN CLASSICO ===================== */

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']).then(() => {});
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Credenziali non valide',
          text: err?.error?.message || 'Email o password errate',
          confirmButtonColor: '#d33'
        }).then(() => {});
      }
    });
  }

  /* ===================== LOGIN SOCIAL ===================== */

  loginWith(provider: 'google' | 'facebook' | 'github'): void {
    this.authService.loginWithProvider(provider);
  }

  /* ===================== FORGOT PASSWORD ===================== */

  openForgotPassword(): void {
    this.dialog.open(ForgotPasswordComponent, {
      width: '400px',
      panelClass: 'custom-dialog'
    });
  }
}
