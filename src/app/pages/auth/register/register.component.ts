import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import  Swal from 'sweetalert2';

import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { AuthService } from '../../../core/auth/auth.service';
import { RegisterRequest } from '../../../models/dto/register-request.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    NavbarComponent,
    RouterLink
  ]
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],   // <--- IMPORTANTE
      password: ['', Validators.required]
    });
  }

  // getter utili per farli usare da angular in modo pubblico
  get nome() { return this.registerForm.get('nome'); }
  get cognome() { return this.registerForm.get('cognome'); }
  get mail() { return this.registerForm.get('mail'); }
  get password() { return this.registerForm.get('password'); }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const data: RegisterRequest = this.registerForm.value;

    this.authService.registerUtente(data).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Registrazione completata!',
          text: 'Ora verrai reindirizzato alla homepage.',
          confirmButtonColor: '#3085d6',
          timer: 1200,
          showConfirmButton: false
        });
        // Redirect automatico dopo il popup
        setTimeout(() => {
          this.router.navigate(['/']).then(() => {
            console.log("Redirect completato!");
          });
        }, 1200);
      } ,
        error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Errore!',
          text: err.error || 'Errore durante la registrazione.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
