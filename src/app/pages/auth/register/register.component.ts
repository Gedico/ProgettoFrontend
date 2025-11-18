import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GoogleLoginModalComponent } from '../../../google-login-modal/google-login-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    GoogleLoginModalComponent   // <-- qui, non negli imports (NO WARNING)
  ]
})
export class RegisterComponent implements OnInit {

  registerForm: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log("Dati registrazione:", this.registerForm.value);
    // TODO: chiamata API
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

openGithubModal() {
  this.dialog.open(GoogleLoginModalComponent, {
    data: { provider: 'github' },
    width: '380px',
    panelClass: 'custom-dialog'
  });
}

}

