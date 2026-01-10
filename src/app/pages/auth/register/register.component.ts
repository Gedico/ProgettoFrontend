import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { finalize, switchMap } from 'rxjs';
import { SessionService } from '../../../services/session.service';
import { LoginService } from '../../../core/auth/login.service';
import { LoginRequest } from '../../../models/dto/auth/login-request.dto';

import { RegisterService } from '../../../core/register/register.service';
import { RegisterRequest } from '../../../models/dto/register-request.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {

  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: RegisterService,
    private loginService: LoginService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      numero: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{8,15}$/) // 8-15 cifre, solo numeri
        ]
      ],
      password: ['', Validators.required]
    });
  }

  // getter utili
  get nome() { return this.registerForm.get('nome'); }
  get cognome() { return this.registerForm.get('cognome'); }
  get mail() { return this.registerForm.get('mail'); }
  get numero() { return this.registerForm.get('numero'); }
  get password() { return this.registerForm.get('password'); }

  onSubmit(): void {
    if (this.isSubmitting) return;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const raw = this.registerForm.getRawValue();

    const registerPayload: RegisterRequest = {
      nome: raw.nome,
      cognome: raw.cognome,
      mail: raw.mail,
      password: raw.password,
      numero: raw.numero,
      indirizzo: '',
      approfondimento: '',
      messaggio: ''
    };

    const loginPayload: LoginRequest = {
      mail: raw.mail,
      password: raw.password
    };

    this.authService.registerUtente(registerPayload).pipe(
      // subito dopo registrazione: login automatico
      switchMap(() => this.loginService.login(loginPayload)),
      finalize(() => (this.isSubmitting = false))
    ).subscribe({
      next: (loginRes) => {
        // salva token => navbar diventa loggata subito
        this.sessionService.setSession(loginRes.token);

        void Swal.fire({
          icon: 'success',
          title: 'Registrazione completata!',
          text: 'Accesso effettuato automaticamente.',
          timer: 1200,
          showConfirmButton: false
        }).then(() => {
          void this.router.navigate(['/']);
        });
      },
      error: (err) => {
        const msg = (err?.error && typeof err.error === 'string')
          ? err.error
          : 'Errore durante la registrazione o il login automatico.';

        void Swal.fire({
          icon: 'error',
          title: 'Errore!',
          text: msg,
          confirmButtonColor: '#d33'
        });
      }
    });
  }

}
