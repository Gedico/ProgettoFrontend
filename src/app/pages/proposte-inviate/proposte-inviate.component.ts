import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropostaService } from '../../services/proposta.service';
import { PropostaResponse } from '../../models/dto/proposta/proposta-response.dto'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-proposte-inviate',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proposte-inviate.component.html',
  styleUrls: ['./proposte-inviate.component.css']
})
export class ProposteInviateComponent implements OnInit {

  proposte: PropostaResponse[] = [];
  caricamento = true;

  constructor(private propostaService: PropostaService) {}

  ngOnInit(): void {
    this.caricaProposte();
  }

  caricaProposte(): void {
    this.propostaService.getProposteUtente().subscribe({
      next: (res) => {
        this.proposte = res || [];
        this.caricamento = false;
      },
      error: () => {
        this.caricamento = false;
      }
    });
  }

  coloreStato(stato: string): string {
    switch(stato) {
      case 'ACCETTATA': return 'green';
      case 'RIFIUTATA': return 'red';
      default: return 'orange';
    }
  }
}
