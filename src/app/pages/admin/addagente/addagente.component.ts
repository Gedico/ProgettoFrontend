import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AdminService} from '../../../services/admin.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-addagente',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './addagente.component.html',
  styleUrl: './addagente.component.css'
})
export class AddagenteComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      numero: ['', [Validators.required,Validators.minLength(10)]],
      agenzia: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.form.invalid) return;

    this.adminService.creaAgente(this.form.value).subscribe({
      next: () => {
        this.snack.open('Agente creato con successo!', 'OK', { duration: 2500 });
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Errore creazione agente';
        this.snack.open(msg, 'Chiudi', { duration: 3000 });
      }
    });
  }



}
