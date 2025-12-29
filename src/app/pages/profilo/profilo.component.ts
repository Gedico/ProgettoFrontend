import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ProfiloService } from '../../services/profilo.service';
import { SessionService } from '../../services/session.service';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';

import { ProfiloResponse } from '../../models/dto/profilo/profilo-response';
import { UpdateProfiloRequest } from '../../models/dto/profilo/update-profilo-request';
import { Role } from '../../models/dto/enums/role';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChangePasswordComponent],
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent implements OnInit {
  form!: FormGroup;

  loading = true;
  saving = false;
  showSuccess = false;

  email = '';
  ruolo = '';

  constructor(
    private fb: FormBuilder,
    private profiloService: ProfiloService,
    private sessionService: SessionService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfilo();
  }

  private initForm(): void {
    const role = this.sessionService.getRole();

    this.form = this.fb.group({
      nome: [{ value: '', disabled: this.isReadOnlyField('nome', role) }, Validators.required],
      cognome: [{ value: '', disabled: this.isReadOnlyField('cognome', role) }, Validators.required],
      numero: [{ value: '', disabled: this.isReadOnlyField('numero', role) }],
      indirizzo: [{ value: '', disabled: this.isReadOnlyField('indirizzo', role) }]
    });
  }

  private isReadOnlyField(field: string, role: string | null): boolean {
    if (!role) return true;

    switch (role) {
      case Role.ADMIN:
        return true;
      case Role.AGENTE:
        return field === 'nome' || field === 'cognome';
      case Role.USER:
      default:
        return false;
    }
  }

  private loadProfilo(): void {
    this.loading = true;

    this.profiloService.getProfilo()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: ProfiloResponse) => {
          this.email = res.mail;
          this.ruolo = String(res.ruolo);

          this.form.patchValue({
            nome: res.nome,
            cognome: res.cognome,
            numero: res.numero,
            indirizzo: res.indirizzo ?? ''
          });
        },
        error: (err) => {
          console.error('Errore caricamento profilo', err);
          Swal.fire('Errore', 'Impossibile caricare i dati del profilo. Riprova più tardi.', 'error');
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.disabled) return;

    this.saving = true;
    this.showSuccess = false;

    // disabilita durante salvataggio (evita doppi click)
    this.form.disable();

    const payload: UpdateProfiloRequest = {
      nome: this.form.get('nome')!.value,
      cognome: this.form.get('cognome')!.value,
      numero: this.form.get('numero')!.value,
      indirizzo: this.form.get('indirizzo')!.value || null
    };

    this.profiloService.updateProfilo(payload)
      .pipe(finalize(() => {
        this.saving = false;

        // riabilita ma rispetta campi readonly per ruolo
        const role = this.sessionService.getRole();
        this.form.enable();
        if (this.isReadOnlyField('nome', role)) this.form.get('nome')?.disable();
        if (this.isReadOnlyField('cognome', role)) this.form.get('cognome')?.disable();
        if (this.isReadOnlyField('numero', role)) this.form.get('numero')?.disable();
        if (this.isReadOnlyField('indirizzo', role)) this.form.get('indirizzo')?.disable();
      }))
      .subscribe({
        next: () => {
          this.showSuccess = true;
          this.loadProfilo();
          setTimeout(() => (this.showSuccess = false), 1200);
        },
        error: (err) => {
          console.error('Errore salvataggio profilo', err);
          Swal.fire(
            'Errore',
            err?.error?.message || 'Errore durante il salvataggio delle modifiche.',
            'error'
          );
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
