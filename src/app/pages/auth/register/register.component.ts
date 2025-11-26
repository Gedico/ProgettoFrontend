import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GoogleLoginModalComponent } from '../../../google-login-modal/google-login-modal.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import {RouterLink} from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


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
    GoogleLoginModalComponent,
    RouterLink,
    MatSnackBarModule
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.snack.open('Compila tutti i campi obbligatori', 'OK', { duration: 2500 });
      return;
    }

    this.snack.open('Registrazione completata!', 'OK', {
      duration: 3000
    });

    // TODO: chiamata API vera
  }


  openGoogleModal() {
    this.dialog.open(GoogleLoginModalComponent, {
      width: '380px',
      panelClass: 'custom-dialog'
    });
  }

  openFacebookModal() {
  this.dialog.open(GoogleLoginModalComponent, {
    data: { provider: 'facebook' },
    width: '380px',
    panelClass: 'custom-dialog'
  });
}

openGitHubModal() {
   window.location.href = "http://localhost:8080/oauth2/authorization/github";
}


}

