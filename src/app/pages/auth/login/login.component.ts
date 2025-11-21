import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginService } from '../../../core/auth/login.service';
import { GoogleLoginModalComponent } from '../../../google-login-modal/google-login-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginService.login(this.loginForm.value).subscribe({
      next: (res) => {
        const token = res.token;
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Errore login:", err);
        alert("Credenziali non valide");
      }
    });
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
}