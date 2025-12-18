import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PropostaService } from '../../../services/proposta.service';
import { PropostaResponse } from '../../../models/dto/proposta/proposta-response.dto';

@Component({
  selector: 'app-registro-proposte',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registro-proposte.component.html',
  styleUrls: ['./registro-proposte.component.css']
})

export class RegistroProposteComponent implements OnInit {

  registro: PropostaResponse[] = [];
  proposteAccettate: PropostaResponse[] = [];
  proposteRifiutate: PropostaResponse[] = [];
  loading = false;

  constructor(private propostaService: PropostaService) {}

  ngOnInit(): void {
    this.caricaRegistro();
  }

  caricaRegistro() {
    this.loading = true;
    this.propostaService.getRegistroProposte().subscribe({
      next: res => {
        this.registro = res || [];

        this.proposteAccettate = this.registro.filter(
          p => p.stato === 'ACCETTATA'
        );

        this.proposteRifiutate = this.registro.filter(
          p => p.stato === 'RIFIUTATA'
        );

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
