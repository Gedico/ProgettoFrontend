import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  form: any;
  loading = false;
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      numero: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
      indirizzo: [''],
      approfondimento: [''],
      messaggio: ['']
    });
  }

  submit() {
    // Reset messaggi
    this.success = '';
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = "Compila correttamente i campi evidenziati.";
      return;
    }

    this.loading = true;

    this.authService.registerUtente(this.form.value).subscribe({
      next: (res: any) => {
        this.success = res.messaggio || 'Registrazione completata!';
        this.error = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.messaggio || 'Errore durante la registrazione';
        this.success = '';
        this.loading = false;
      }
    });
  }
}
