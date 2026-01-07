import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

type MessageType = 'success' | 'error' | '';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm!: FormGroup;
  message = '';
  messageType: MessageType = '';
  loading = false;

  private readonly endpoint = 'http://localhost:8080/api/password/reset-request';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotForm.get('email');
  }

  sendRequest(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const email = String(this.forgotForm.value.email).trim();

    this.loading = true;
    this.message = '';
    this.messageType = '';

    this.http.post<void>(this.endpoint, { email }).pipe(
      finalize(() => (this.loading = false))
    ).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = "Se l'email è corretta, a breve riceverai un'email con il link per il reset.";

        // chiude dopo 5 secondi
        setTimeout(() => this.dialogRef.close(), 5000);
      },
      error: () => {
        this.messageType = 'error';
        this.message = "Si è verificato un errore durante la richiesta. Riprova più tardi.";
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
