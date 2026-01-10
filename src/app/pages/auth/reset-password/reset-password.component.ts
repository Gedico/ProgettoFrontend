import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  token: string | null = null;
  message = '';
  isSuccess = false;

  resetForm: any;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
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
      this.isSuccess = false; // ← AGGIUNTO
      return;
    }

    const payload = {
      token: this.token,
      newPassword: this.resetForm.value.newPassword
    };

    this.http.post('http://localhost:8080/api/password/reset', payload)
      .subscribe({
        next: (res: any) => {
          this.isSuccess = true; // ← AGGIUNTO

          // 1. Mostra popup
          this.snackBar.open(res.message, "OK", {
            duration: 2500,
            panelClass: ['success-snackbar']
          });

          // 2. Reindirizza alla landing dopo 2.5 secondi
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2500);
        },

        error: () => {
          this.isSuccess = false; // ← AGGIUNTO

          this.snackBar.open("Errore interno. Riprova più tardi.", "OK", {
            duration: 2500,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

}
