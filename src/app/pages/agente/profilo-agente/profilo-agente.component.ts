import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfiloService } from '../../../services/profilo.service';
import { ChangePasswordComponent } from '../../../components/change-password/change-password.component';

@Component({
  selector: 'app-profilo-agente',
  standalone: true,
  imports: [
    CommonModule,
    ChangePasswordComponent
  ],
  templateUrl: './profilo-agente.component.html',
  styleUrls: ['./profilo-agente.component.css']
})
export class ProfiloAgenteComponent implements OnInit {

  email = '';
  ruolo = '';

  loading = true;

  constructor(private profiloService: ProfiloService) {}

  ngOnInit(): void {
    this.profiloService.getProfilo().subscribe({
      next: res => {
        this.email = res.mail;
        this.ruolo = String(res.ruolo);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
