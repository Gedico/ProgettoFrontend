import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: any;
  message = '';
  messageType: 'success' | 'error' | '' = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) {}

  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendRequest() {
    if (this.forgotForm.invalid) {
      return;
    }

    const email = this.forgotForm.value.email;

    this.loading = true;
    this.message = '';
    this.messageType = '';

    this.http.post('http://localhost:8080/api/password/reset-request', { email })
      .subscribe({
        next: () => {
          this.messageType = 'success';
          this.message = "Se l'email è corretta, a breve riceverai un'email con il link per il reset.";
          this.loading = false;

          // chiude dopo 5 secondi
          setTimeout(() => this.dialogRef.close(), 5000);
        },
        error: () => {
          this.messageType = 'error';
          this.message = "Si è verificato un errore durante la richiesta. Riprova più tardi.";
          this.loading = false;
        }
      });
  }
}



