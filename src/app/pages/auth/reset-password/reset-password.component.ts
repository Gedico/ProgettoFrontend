import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  token: string | null = null;
  message = '';

  resetForm: any;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }


  submitNewPassword() {
    if (this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword) {
      this.message = "Le password non coincidono.";
      return;
    }

    const payload = {
      token: this.token,
      newPassword: this.resetForm.value.newPassword
    };

    this.http.post('http://localhost:8080/api/password/reset', payload)
      .subscribe({
        next: () => this.message = "Password aggiornata con successo.",
        error: () => this.message = "Errore durante la modifica della password."
      });
  }
}

