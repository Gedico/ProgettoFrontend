import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginService } from '../../../core/auth/login.service';
import { GoogleLoginModalComponent } from '../../../google-login-modal/google-login-modal.component';
import { SessionService } from '../../../services/session.service';
import {MatSnackBar} from '@angular/material/snack-bar';


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
    private dialog: MatDialog,
    private sessionService: SessionService,
    private snack: MatSnackBar
) {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.sessionService.setSession(res.token);
        this.snack.open('Login effettuato con successo', 'OK', { duration: 2500 });
        this.router.navigate(['/']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Credenziali non valide';
        this.snack.open(msg, 'Chiudi', { duration: 3000});
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

  openGithubModal() {
    this.dialog.open(GoogleLoginModalComponent, {
      data: { provider: 'github' },
      width: '380px',
      panelClass: 'custom-dialog'
    });
  }
}
