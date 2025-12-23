import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

import { ProfiloService } from '../../services/profilo.service';
import { SessionService } from '../../services/session.service';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';

import { ProfiloResponse } from '../../models/dto/profilo/profilo-response';
import { UpdateProfiloRequest } from '../../models/dto/profilo/update-profilo-request';
import { Role } from '../../models/dto/enums/role';

@Component({
  selector: 'app-profilo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChangePasswordComponent
  ],
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
    this.profiloService.getProfilo().subscribe({
      next: (res: ProfiloResponse) => {
        this.email = res.mail;
        this.ruolo = String(res.ruolo);

        this.form.patchValue({
          nome: res.nome,
          cognome: res.cognome,
          numero: res.numero,
          indirizzo: res.indirizzo ?? ''
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.disabled) return;

    this.saving = true;
    this.showSuccess = false;

    const payload: UpdateProfiloRequest = {
      nome: this.form.get('nome')!.value,
      cognome: this.form.get('cognome')!.value,
      numero: this.form.get('numero')!.value,
      indirizzo: this.form.get('indirizzo')!.value || null
    };

    this.profiloService.updateProfilo(payload).subscribe({
      next: () => {
        this.saving = false;
        this.showSuccess = true;

        setTimeout(() => {
          this.loadProfilo();
          this.showSuccess = false;
        }, 1000);
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
