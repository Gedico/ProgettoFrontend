import { ForgotPasswordComponent } from '../../../components/auth/forgot-password/forgot-password.component';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SessionService } from '../../../services/session.service';
import { LoginService } from '../../../core/auth/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {goOffline} from '@angular/fire/database';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
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

/*******ON SUBMIT******************************************************************************************************************/

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.snack.open(err.error?.message || 'Credenziali non valide')
    });

  }


  /****LOGIN CON API*****************************************************************************************************************/


  loginWith(provider: 'google' | 'facebook' | 'github') {
    this.authService.loginWithProvider(provider);
  }


  /********FORGOT PASSWORD****************************************************************************************************************/

    openForgotPassword() {
      this.dialog.open(ForgotPasswordComponent, {
        width: '400px',
        panelClass: 'custom-dialog'
      });
    }

  protected readonly goOffline = goOffline;
}
