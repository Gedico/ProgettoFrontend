import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

type UiState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-addagente',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './addagente.component.html',
  styleUrls: ['./addagente.component.css']
})
export class AddagenteComponent {
  form: FormGroup;

  uiState: UiState = 'idle';
  inlineMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      numero: ['', [Validators.required, Validators.minLength(10)]],
      agenzia: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  // === Helper PUBLIC per template (niente touched/invalid diretti) ===
  control(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  isInvalid(name: string): boolean {
    const c = this.control(name);
    return !!c && c.touched && c.invalid;
  }

  getFieldError(name: string): string {
    const c = this.control(name);
    if (!c || !c.touched || !c.errors) return '';

    if (c.errors['required']) return 'Campo obbligatorio';
    if (c.errors['email']) return 'Email non valida';
    if (c.errors['minlength']) {
      const req = c.errors['minlength'].requiredLength;
      return `Minimo ${req} caratteri`;
    }
    return 'Valore non valido';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private openSnack(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snack.open(message, 'OK', {
      duration: 2800,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snack-${type}`]
    });
  }

  onSubmit() {
    this.inlineMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.uiState = 'error';
      this.inlineMessage = 'Controlla i campi evidenziati e riprova.';
      this.openSnack('Alcuni campi non sono validi', 'error');
      return;
    }

    this.uiState = 'loading';

    const payload = {
      ...this.form.value,
      numero: String(this.form.value.numero).replace(/\s+/g, '')
    };

    this.adminService.creaAgente(payload).subscribe({
      next: () => {
        this.uiState = 'success';
        this.inlineMessage = 'Agente creato con successo! Reindirizzamento in corso...';
        this.openSnack('Agente creato con successo!', 'success');
        setTimeout(() => this.router.navigate(['/admin']), 700);
      },
      error: (err) => {
        this.uiState = 'error';
        const msg = err?.error?.message || 'Errore durante la creazione dell’agente';
        this.inlineMessage = msg;
        this.openSnack(msg, 'error');
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.uiState = 'idle';
    this.inlineMessage = '';
  }
}
