import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { ProfiloService } from '../../../services/profilo.service';
import { ChangePasswordComponent } from '../../../components/change-password/change-password.component';

@Component({
  selector: 'app-profilo-agente',
  standalone: true,
  imports: [CommonModule, ChangePasswordComponent],
  templateUrl: './profilo-agente.component.html',
  styleUrls: ['./profilo-agente.component.css']
})
export class ProfiloAgenteComponent implements OnInit {
  email = '';
  ruolo = '';
  specializzazione = 'Inserzioni immobiliari';

  loading = true;
  errore = false;

  constructor(private profiloService: ProfiloService) {}

  ngOnInit(): void {
    this.loading = true;
    this.errore = false;

    this.profiloService.getProfilo()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.email = res?.mail ?? '';
          this.ruolo = String(res?.ruolo ?? 'AGENTE');
          // se in futuro il backend manda la specializzazione, la usiamo
          this.specializzazione = res?.specializzazione ?? this.specializzazione;
        },
        error: () => {
          this.errore = true;
        }
      });
  }
}
